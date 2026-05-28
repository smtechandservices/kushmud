from django.contrib import admin
from api.models import Package, Destination, Offer, Testimonial, Booking, ContactInquiry

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'destination', 'region', 'type', 'price', 'featured')
    list_filter = ('region', 'type', 'featured')
    search_fields = ('title', 'destination')

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'count', 'tag', 'size')
    search_fields = ('name',)

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'tag', 'code', 'accent')
    search_fields = ('title', 'code')

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'place')
    search_fields = ('name', 'place')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'pkg', 'dates', 'total', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('id', 'name', 'pkg')

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'destination', 'created_at')
    list_filter = ('destination',)
    search_fields = ('first_name', 'last_name', 'email', 'destination')
