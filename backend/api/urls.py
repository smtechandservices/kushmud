from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    PackageViewSet, DestinationViewSet, OfferViewSet,
    TestimonialViewSet, BookingViewSet, ContactInquiryViewSet, StatsView,
    FAQViewSet, StoryViewSet, NewsletterSubscriberViewSet, MeView, SiteStatsView,
    ChangePasswordView, CustomerViewSet, CustomerSignupView, CustomerLoginView,
    CustomerMeView, JobOpeningViewSet, PackageReviewViewSet, FavoriteViewSet,
    CustomerNewsletterView, AnalyticsView, AdminUserViewSet, FlyerViewSet
)

router = DefaultRouter()
router.register(r'packages', PackageViewSet, basename='package')
router.register(r'package-reviews', PackageReviewViewSet, basename='package-review')
router.register(r'destinations', DestinationViewSet, basename='destination')
router.register(r'offers', OfferViewSet, basename='offer')
router.register(r'flyers', FlyerViewSet, basename='flyer')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'inquiries', ContactInquiryViewSet, basename='inquiry')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'stories', StoryViewSet, basename='story')
router.register(r'newsletter-subscribers', NewsletterSubscriberViewSet, basename='newsletter-subscriber')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'job-openings', JobOpeningViewSet, basename='job-opening')
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'admins', AdminUserViewSet, basename='admin')

urlpatterns = [
    path('stats/', StatsView.as_view(), name='stats'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('site-stats/', SiteStatsView.as_view(), name='site-stats'),
    path('me/', MeView.as_view(), name='me'),
    path('me/password/', ChangePasswordView.as_view(), name='change-password'),
    path('customers/signup/', CustomerSignupView.as_view(), name='customer-signup'),
    path('customers/login/', CustomerLoginView.as_view(), name='customer-login'),
    path('customers/me/', CustomerMeView.as_view(), name='customer-me'),
    path('customers/me/newsletter/', CustomerNewsletterView.as_view(), name='customer-newsletter'),
    path('', include(router.urls)),
]
