from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import (
    Package, Destination, Region, Offer, Testimonial, Booking, ContactInquiry,
    FAQ, Story, NewsletterSubscriber, Customer, JobOpening, PackageReview, Favorite, Flyer
)

class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = '__all__'

class PackageReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageReview
        fields = '__all__'
        read_only_fields = ['created_at']

class FavoriteSerializer(serializers.ModelSerializer):
    package = PackageSerializer(read_only=True)
    package_id = serializers.PrimaryKeyRelatedField(queryset=Package.objects.all(), source='package', write_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'package', 'package_id', 'created_at']
        read_only_fields = ['id', 'created_at']

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class DestinationSerializer(serializers.ModelSerializer):
    count = serializers.ReadOnlyField()

    class Meta:
        model = Destination
        fields = '__all__'

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    destination = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['id', 'customer']

    def get_destination(self, obj):
        return Package.objects.filter(title=obj.pkg).values_list('destination', flat=True).first()

class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = '__all__'

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = '__all__'

class JobOpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOpening
        fields = '__all__'

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'
        read_only_fields = ['subscribed_at']

class FlyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flyer
        fields = '__all__'
        read_only_fields = ['created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_superuser']
        read_only_fields = ['username', 'is_superuser']

class AdminUserSerializer(serializers.ModelSerializer):
    """Superuser-only management of admin/staff accounts (frontend-admin /admins page)."""
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_superuser', 'is_active', 'password']

    def validate_username(self, value):
        qs = User.objects.filter(username=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('An admin with this username already exists.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({'password': 'Password is required.'})
        user = User(**validated_data, is_staff=True)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone', 'is_active', 'created_at']
        read_only_fields = ['created_at']

class CustomerSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone', 'password']

    def validate_email(self, value):
        value = value.strip().lower() if value else value
        if value and Customer.objects.filter(email=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate_phone(self, value):
        value = value.strip() if value else value
        if value and Customer.objects.filter(phone=value).exists():
            raise serializers.ValidationError('An account with this phone number already exists.')
        return value

    def validate(self, attrs):
        if not attrs.get('email') and not attrs.get('phone'):
            raise serializers.ValidationError('Provide an email or phone number.')
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        customer = Customer(**validated_data)
        customer.set_password(password)
        customer.save()
        return customer
