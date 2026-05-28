from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    PackageViewSet, DestinationViewSet, OfferViewSet, 
    TestimonialViewSet, BookingViewSet, ContactInquiryViewSet, StatsView
)

router = DefaultRouter()
router.register(r'packages', PackageViewSet, basename='package')
router.register(r'destinations', DestinationViewSet, basename='destination')
router.register(r'offers', OfferViewSet, basename='offer')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'inquiries', ContactInquiryViewSet, basename='inquiry')

urlpatterns = [
    path('stats/', StatsView.as_view(), name='stats'),
    path('', include(router.urls)),
]
