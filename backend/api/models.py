from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.utils import timezone


class Customer(AbstractBaseUser):
    USERNAME_FIELD = 'email'

    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254, unique=True, null=True, blank=True)
    phone = models.CharField(max_length=30, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.strip().lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name or self.email or self.phone or f"Customer {self.pk}"

class Package(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    region = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    duration = models.IntegerField()
    nights = models.IntegerField()
    rating = models.FloatField(default=5.0)
    reviews = models.IntegerField(default=0)
    price = models.IntegerField()
    priceWas = models.IntegerField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    badge = models.CharField(max_length=100, null=True, blank=True)
    blurb = models.TextField()
    img = models.TextField()
    gallery = models.JSONField(default=list, blank=True)
    highlights = models.JSONField(default=list, blank=True)
    itinerary = models.JSONField(default=list, blank=True)
    group_size = models.CharField(max_length=50, null=True, blank=True)
    best_months = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.title

class Favorite(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='favorites')
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('customer', 'package')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer} likes {self.package_id}"

class PackageReview(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='review_entries')
    name = models.CharField(max_length=100)
    quote = models.TextField()
    rating = models.FloatField(default=5.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} on {self.package_id}"

class Region(models.Model):
    name = models.CharField(max_length=100, primary_key=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Destination(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    region = models.ForeignKey(Region, on_delete=models.PROTECT, db_column='region', related_name='destinations')
    img = models.TextField()
    tag = models.CharField(max_length=100)
    size = models.CharField(max_length=20, null=True, blank=True)

    @property
    def count(self):
        return Package.objects.filter(destination__icontains=self.name).count()

    def __str__(self):
        return self.name

class Offer(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    tag = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    sub = models.CharField(max_length=200)
    code = models.CharField(max_length=50)
    img = models.TextField()
    accent = models.CharField(max_length=20)

    def __str__(self):
        return self.title

class Testimonial(models.Model):
    quote = models.TextField()
    name = models.CharField(max_length=100)
    place = models.CharField(max_length=100)
    avatar = models.TextField()

    def __str__(self):
        return f"{self.name} - {self.place}"

class Booking(models.Model):
    id = models.CharField(max_length=20, primary_key=True)  # e.g., WF-2841
    customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL, related_name='bookings')
    name = models.CharField(max_length=100)
    avatar = models.TextField(default="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop")
    pkg = models.CharField(max_length=200)  # package title
    dates = models.CharField(max_length=100)
    total = models.IntegerField()
    status = models.CharField(max_length=20, default="pending")  # confirmed, pending, cancelled
    email = models.EmailField(max_length=254, null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    pax = models.IntegerField(default=1)
    remarks = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} - {self.name} - {self.pkg}"

class FAQ(models.Model):
    question = models.CharField(max_length=300)
    answer = models.TextField()
    category = models.CharField(max_length=100, null=True, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.question

class Story(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    title = models.CharField(max_length=200)
    excerpt = models.TextField()
    body = models.TextField(null=True, blank=True)
    img = models.TextField()
    author = models.CharField(max_length=100, null=True, blank=True)
    tag = models.CharField(max_length=100, null=True, blank=True)
    published_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_APPROVED)
    customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL, related_name='stories')

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title

class JobOpening(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    type = models.CharField(max_length=50, default="Full-time")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email

class Flyer(models.Model):
    img = models.TextField()
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Flyer {self.pk}"

class ContactInquiry(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    destination = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.destination}"

class B2BInquiry(models.Model):
    TYPE_CORPORATE = 'Corporate Custom Travel'
    TYPE_SPORTS_TEAM = 'Sports Travel — Team'
    TYPE_SPORTS_INDIVIDUAL = 'Sports Travel — Individual'
    TYPE_TRAVEL_AGENCY = 'Travel Agency — Bulk Reseller'
    TYPE_OTHER = 'Other'
    TYPE_CHOICES = [
        (TYPE_CORPORATE, TYPE_CORPORATE),
        (TYPE_SPORTS_TEAM, TYPE_SPORTS_TEAM),
        (TYPE_SPORTS_INDIVIDUAL, TYPE_SPORTS_INDIVIDUAL),
        (TYPE_TRAVEL_AGENCY, TYPE_TRAVEL_AGENCY),
        (TYPE_OTHER, TYPE_OTHER),
    ]

    STATUS_NEW = 'new'
    STATUS_CONTACTED = 'contacted'
    STATUS_CLOSED = 'closed'
    STATUS_CHOICES = [
        (STATUS_NEW, 'New'),
        (STATUS_CONTACTED, 'Contacted'),
        (STATUS_CLOSED, 'Closed'),
    ]

    organization = models.CharField(max_length=200)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=50, null=True, blank=True)
    inquiry_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default=TYPE_OTHER)
    group_size = models.CharField(max_length=50, null=True, blank=True)
    requested_margin_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'B2B Inquiry'
        verbose_name_plural = 'B2B Inquiries'

    def __str__(self):
        return f"{self.organization} - {self.inquiry_type}"

class SiteEffectSetting(models.Model):
    EFFECT_NONE = 'none'
    EFFECT_SNOW = 'snow'
    EFFECT_RAIN = 'rain'
    EFFECT_AUTUMN = 'autumn'
    EFFECT_INDEPENDENCE_DAY = 'independence_day'
    EFFECT_CHOICES = [
        (EFFECT_NONE, 'None'),
        (EFFECT_SNOW, 'Snow'),
        (EFFECT_RAIN, 'Rain'),
        (EFFECT_AUTUMN, 'Autumn'),
        (EFFECT_INDEPENDENCE_DAY, 'Independence Day'),
    ]

    active_effect = models.CharField(max_length=20, choices=EFFECT_CHOICES, default=EFFECT_NONE)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.active_effect
