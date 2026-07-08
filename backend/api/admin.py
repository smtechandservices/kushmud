from django import forms
from django.contrib import admin
from api.models import Package, Destination, Region, Offer, Testimonial, Booking, ContactInquiry

class PackageAdminForm(forms.ModelForm):
    destination = forms.ChoiceField(choices=[])

    class Meta:
        model = Package
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['destination'].choices = [
            (name, name) for name in Destination.objects.order_by('name').values_list('name', flat=True)
        ]


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    form = PackageAdminForm
    list_display = ('title', 'destination', 'region', 'type', 'price', 'featured')
    list_filter = ('region', 'type', 'featured')
    search_fields = ('title', 'destination')

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'count', 'tag', 'size')
    list_filter = ('region',)
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
