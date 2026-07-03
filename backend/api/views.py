import re
import calendar
from datetime import timedelta
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum, Avg, Q
from django.utils import timezone
from api.authentication import CustomerJWTAuthentication
from api.models import (
    Package, Destination, Offer, Testimonial, Booking, ContactInquiry,
    FAQ, Story, NewsletterSubscriber, Customer, JobOpening, PackageReview
)
from api.serializers import (
    PackageSerializer, DestinationSerializer, OfferSerializer,
    TestimonialSerializer, BookingSerializer, ContactInquirySerializer,
    FAQSerializer, StorySerializer, NewsletterSubscriberSerializer, UserSerializer,
    CustomerSerializer, CustomerSignupSerializer, JobOpeningSerializer, PackageReviewSerializer
)

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
        serializer.save(id=new_id)

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

class CustomerViewSet(viewsets.ModelViewSet):
    """Admin-only management of registered customer accounts (frontend-admin /customers page)."""
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

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
