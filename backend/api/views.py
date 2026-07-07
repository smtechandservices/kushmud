import re
import calendar
from datetime import timedelta
from rest_framework import viewsets, status, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum, Avg, Q, Count
from django.utils import timezone
from api.authentication import CustomerJWTAuthentication
from api.models import (
    Package, Destination, Offer, Testimonial, Booking, ContactInquiry,
    FAQ, Story, NewsletterSubscriber, Customer, JobOpening, PackageReview, Favorite
)
from django.contrib.auth.models import User
from api.serializers import (
    PackageSerializer, DestinationSerializer, OfferSerializer,
    TestimonialSerializer, BookingSerializer, ContactInquirySerializer,
    FAQSerializer, StorySerializer, NewsletterSubscriberSerializer, UserSerializer,
    CustomerSerializer, CustomerSignupSerializer, JobOpeningSerializer, PackageReviewSerializer,
    FavoriteSerializer, AdminUserSerializer
)

class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)

def issue_customer_tokens(customer):
    refresh = RefreshToken.for_user(customer)
    refresh['scope'] = 'customer'
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    FEATURED_LIMIT = 3

    def perform_create(self, serializer):
        instance = serializer.save()
        self._enforce_featured_limit(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        self._enforce_featured_limit(instance)

    def _enforce_featured_limit(self, instance):
        if not instance.featured:
            return
        other_featured = Package.objects.filter(featured=True).exclude(pk=instance.pk)
        excess = other_featured.count() - (self.FEATURED_LIMIT - 1)
        for pkg in other_featured[:excess]:
            pkg.featured = False
            pkg.save(update_fields=['featured'])

class PackageReviewViewSet(viewsets.ModelViewSet):
    serializer_class = PackageReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = PackageReview.objects.all()
        package_id = self.request.query_params.get('package')
        if package_id:
            qs = qs.filter(package_id=package_id)
        return qs

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-id')
    serializer_class = BookingSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_authenticators(self):
        # self.action isn't set yet at this point in the request lifecycle,
        # so derive it from the action_map the same way DRF does later on.
        action = getattr(self, 'action_map', {}).get(self.request.method.lower())
        if action in ('create', 'mine'):
            return [CustomerJWTAuthentication()]
        return super().get_authenticators()

    def perform_create(self, serializer):
        # Generate custom Booking ID (e.g. WF-2842)
        highest_id = 2841
        bookings = Booking.objects.all()
        for b in bookings:
            match = re.search(r'WF-(\d+)', b.id)
            if match:
                val = int(match.group(1))
                if val > highest_id:
                    highest_id = val

        new_id = f"WF-{highest_id + 1}"
        customer = self.request.user if isinstance(self.request.user, Customer) else None
        serializer.save(id=new_id, customer=customer)

    @action(detail=False, methods=['get'])
    def mine(self, request):
        bookings = Booking.objects.filter(customer=request.user).order_by('-created_at')
        return Response(BookingSerializer(bookings, many=True).data)

class ContactInquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactInquiry.objects.all().order_by('-created_at')
    serializer_class = ContactInquirySerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class JobOpeningViewSet(viewsets.ModelViewSet):
    queryset = JobOpening.objects.all()
    serializer_class = JobOpeningSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class CustomerSignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        serializer = CustomerSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = serializer.save()
        return Response(
            {**issue_customer_tokens(customer), 'customer': CustomerSerializer(customer).data},
            status=status.HTTP_201_CREATED
        )

class CustomerLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        identifier = (request.data.get('identifier') or '').strip()
        password = request.data.get('password') or ''
        if not identifier or not password:
            return Response({"detail": "identifier and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        customer = Customer.objects.filter(
            Q(email=identifier.lower()) | Q(phone=identifier)
        ).first()

        if customer is None or not customer.is_active or not customer.check_password(password):
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({**issue_customer_tokens(customer), 'customer': CustomerSerializer(customer).data})

class CustomerMeView(APIView):
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        return Response(CustomerSerializer(request.user).data)

    def patch(self, request, format=None):
        serializer = CustomerSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class CustomerNewsletterView(APIView):
    """Lets a logged-in customer check and manage their newsletter subscription (keyed by their email)."""
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        email = request.user.email
        subscribed = bool(email) and NewsletterSubscriber.objects.filter(email=email).exists()
        return Response({'subscribed': subscribed, 'email': email})

    def post(self, request, format=None):
        email = request.user.email
        if not email:
            return Response({'detail': 'Add an email to your account before subscribing.'}, status=status.HTTP_400_BAD_REQUEST)
        NewsletterSubscriber.objects.get_or_create(email=email)
        return Response({'subscribed': True, 'email': email})

    def delete(self, request, format=None):
        email = request.user.email
        if email:
            NewsletterSubscriber.objects.filter(email=email).delete()
        return Response({'subscribed': False, 'email': email})

class FavoriteViewSet(viewsets.ModelViewSet):
    """Customer-facing favorites (liked packages). Requires customer login."""
    serializer_class = FavoriteSerializer
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        return Favorite.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        package_id = request.data.get('package')
        if not package_id:
            return Response({'detail': 'package is required.'}, status=status.HTTP_400_BAD_REQUEST)
        package = get_object_or_404(Package, pk=package_id)
        existing = Favorite.objects.filter(customer=request.user, package=package).first()
        if existing:
            existing.delete()
            return Response({'favorited': False})
        Favorite.objects.create(customer=request.user, package=package)
        return Response({'favorited': True}, status=status.HTTP_201_CREATED)

class CustomerViewSet(viewsets.ModelViewSet):
    """Admin-only management of registered customer accounts (frontend-admin /customers page)."""
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

class AdminUserViewSet(viewsets.ModelViewSet):
    """Superuser-only management of admin/staff accounts (frontend-admin /admins page)."""
    queryset = User.objects.all().order_by('username')
    serializer_class = AdminUserSerializer
    permission_classes = [IsSuperUser]

    def perform_destroy(self, instance):
        if instance == self.request.user:
            raise ValidationError('You cannot delete your own account.')
        instance.delete()

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        return Response(UserSerializer(request.user).data)

    def patch(self, request, format=None):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not old_password or not new_password:
            return Response({"detail": "old_password and new_password are required."}, status=status.HTTP_400_BAD_REQUEST)
        if not request.user.check_password(old_password):
            return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 8:
            return Response({"detail": "New password must be at least 8 characters."}, status=status.HTTP_400_BAD_REQUEST)
        request.user.set_password(new_password)
        request.user.save()
        return Response({"detail": "Password updated."})

class SiteStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        avg_rating = Package.objects.aggregate(avg_r=Avg('rating'))['avg_r'] or 0

        week_ago = timezone.now() - timedelta(days=7)
        packages = list(Package.objects.all())
        recent_counts = {p.id: Booking.objects.filter(pkg=p.title, created_at__gte=week_ago).count() for p in packages}
        has_recent_activity = any(count > 0 for count in recent_counts.values())

        if has_recent_activity:
            ranked = sorted(packages, key=lambda p: recent_counts.get(p.id, 0), reverse=True)
            basis = "inquiries"
        else:
            ranked = sorted(packages, key=lambda p: p.rating, reverse=True)
            basis = "rating"

        trending = [{
            "id": p.id,
            "title": p.title,
            "img": p.img,
            "price": p.price,
            "region": p.region,
            "type": p.type,
            "duration": p.duration,
        } for p in ranked[:4]]

        return Response({
            "active_trips": Package.objects.count(),
            "cities_covered": Destination.objects.count(),
            "avg_rating": round(avg_rating, 2),
            "trending": trending,
            "trending_basis": basis,
        })

class StatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # Calculate MTD confirmed revenue
        revenue_mtd = Booking.objects.filter(status='confirmed').aggregate(total_rev=Sum('total'))['total_rev'] or 0

        total_bookings = Booking.objects.count()
        pending_bookings_count = Booking.objects.filter(status='pending').count()
        contact_inquiries_count = ContactInquiry.objects.count()
        pending_inquiries = pending_bookings_count + contact_inquiries_count

        avg_rating = Package.objects.aggregate(avg_r=Avg('rating'))['avg_r'] or 0
        avg_rating = round(avg_rating, 2)

        # Build monthly booking trend chart from real booking dates
        now = timezone.now()
        months = []
        year, month = now.year, now.month
        for _ in range(6):
            months.append((year, month))
            month -= 1
            if month == 0:
                month = 12
                year -= 1
        months.reverse()

        monthly_trend = []
        labels = []
        for year, month in months:
            count = Booking.objects.filter(created_at__year=year, created_at__month=month).count()
            monthly_trend.append(count)
            labels.append(calendar.month_abbr[month])

        # Calculate top packages dynamically based on real booking count
        packages = Package.objects.all()
        pkg_bookings_count = {}
        for p in packages:
            pkg_bookings_count[p.id] = Booking.objects.filter(pkg=p.title).count()

        # Sort packages by booking count
        sorted_packages = sorted(packages, key=lambda x: pkg_bookings_count.get(x.id, 0), reverse=True)
        top_packages = []
        for p in sorted_packages[:5]:
            top_packages.append({
                "id": p.id,
                "title": p.title,
                "img": p.img,
                "price": p.price,
                "bookings": pkg_bookings_count.get(p.id, 0)
            })

        return Response({
            "kpis": {
                "total_bookings": total_bookings,
                "revenue_mtd": f"₹{revenue_mtd // 1000}k" if revenue_mtd >= 1000 else f"₹{revenue_mtd}",
                "pending_inquiries": pending_inquiries,
                "avg_rating": avg_rating
            },
            "chart": {
                "monthly": monthly_trend,
                "labels": labels
            },
            "top_packages": top_packages
        })

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    MONTHS_BACK = 6

    def get(self, request, format=None):
        now = timezone.now()
        months = []
        year, month = now.year, now.month
        for _ in range(self.MONTHS_BACK):
            months.append((year, month))
            month -= 1
            if month == 0:
                month = 12
                year -= 1
        months.reverse()
        labels = [calendar.month_abbr[m] for _, m in months]

        confirmed = Booking.objects.filter(status='confirmed')

        revenue_trend = []
        bookings_trend = []
        for year, month in months:
            month_bookings = Booking.objects.filter(created_at__year=year, created_at__month=month)
            bookings_trend.append(month_bookings.count())
            revenue_trend.append(
                month_bookings.filter(status='confirmed').aggregate(total=Sum('total'))['total'] or 0
            )

        total_revenue = confirmed.aggregate(total=Sum('total'))['total'] or 0
        total_bookings = Booking.objects.count()
        confirmed_count = confirmed.count()
        avg_booking_value = round(total_revenue / confirmed_count) if confirmed_count else 0

        status_counts = {row['status']: row['count'] for row in
                          Booking.objects.values('status').annotate(count=Count('id'))}
        status_breakdown = [
            {"status": s, "count": status_counts.get(s, 0)}
            for s in ('confirmed', 'pending', 'cancelled')
        ]

        total_inquiries = ContactInquiry.objects.count()
        conversion_rate = round((confirmed_count / total_inquiries) * 100, 1) if total_inquiries else 0

        pkg_lookup = {p.title: p for p in Package.objects.all()}
        region_revenue = {}
        type_revenue = {}
        for b in confirmed:
            pkg = pkg_lookup.get(b.pkg)
            region = pkg.region if pkg else 'Other'
            trip_type = pkg.type if pkg else 'Other'
            region_revenue[region] = region_revenue.get(region, 0) + b.total
            type_revenue[trip_type] = type_revenue.get(trip_type, 0) + b.total

        revenue_by_region = [
            {"region": r, "revenue": v}
            for r, v in sorted(region_revenue.items(), key=lambda x: x[1], reverse=True)
        ]
        revenue_by_type = [
            {"type": t, "revenue": v}
            for t, v in sorted(type_revenue.items(), key=lambda x: x[1], reverse=True)
        ]

        destination_counts = {}
        for b in Booking.objects.all():
            pkg = pkg_lookup.get(b.pkg)
            destination = pkg.destination if pkg else b.pkg
            destination_counts[destination] = destination_counts.get(destination, 0) + 1
        top_destinations = [
            {"destination": d, "bookings": c}
            for d, c in sorted(destination_counts.items(), key=lambda x: x[1], reverse=True)[:6]
        ]

        customer_growth = []
        for year, month in months:
            customer_growth.append(
                Customer.objects.filter(created_at__year=year, created_at__month=month).count()
            )

        return Response({
            "kpis": {
                "total_revenue": total_revenue,
                "total_bookings": total_bookings,
                "avg_booking_value": avg_booking_value,
                "conversion_rate": conversion_rate,
            },
            "labels": labels,
            "revenue_trend": revenue_trend,
            "bookings_trend": bookings_trend,
            "customer_growth": customer_growth,
            "status_breakdown": status_breakdown,
            "revenue_by_region": revenue_by_region,
            "revenue_by_type": revenue_by_type,
            "top_destinations": top_destinations,
        })
