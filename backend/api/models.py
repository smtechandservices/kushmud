from django.db import models

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

    def __str__(self):
        return self.title

class Destination(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    count = models.IntegerField(default=0)
    img = models.TextField()
    tag = models.CharField(max_length=100)
    size = models.CharField(max_length=20, null=True, blank=True)

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
    name = models.CharField(max_length=100)
    avatar = models.TextField(default="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop")
    pkg = models.CharField(max_length=200)  # package title
    dates = models.CharField(max_length=100)
    total = models.IntegerField()
    status = models.CharField(max_length=20, default="pending")  # confirmed, pending, cancelled
    email = models.EmailField(max_length=254, null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    passport_country = models.CharField(max_length=100, null=True, blank=True)
    dietary_notes = models.TextField(null=True, blank=True)
    traveler_2_name = models.CharField(max_length=100, null=True, blank=True)
    traveler_2_dob = models.CharField(max_length=50, null=True, blank=True)  # Keep as string for flexibility
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} - {self.name} - {self.pkg}"

class ContactInquiry(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    destination = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.destination}"
