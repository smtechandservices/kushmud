import os
import json
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import Package, Destination, Offer, Testimonial, Booking

class Command(BaseCommand):
    help = 'Seeds the database with package, destination, offer, testimonial, and booking data from Next.js assets.'

    def handle(self, *args, **options):
        # The script is in backend/api/management/commands/seed.py
        # We need to get to workspace root /Users/apple/Desktop/kushmud/
        current_file_path = os.path.abspath(__file__)
        # backend/api/management/commands/seed.py -> 5 levels up to reach /Users/apple/Desktop/kushmud/
        parent_dir = current_file_path
        for _ in range(5):
            parent_dir = os.path.dirname(parent_dir)

        assets_dir = os.path.join(parent_dir, 'frontend', 'src', 'assets')

        self.stdout.write(f"Looking for assets in: {assets_dir}")

        # Seed Packages
        packages_path = os.path.join(assets_dir, 'packages.json')
        if os.path.exists(packages_path):
            Package.objects.all().delete()
            with open(packages_path, 'r') as f:
                data = json.load(f)
                for item in data:
                    Package.objects.create(
                        id=item.get('id'),
                        title=item.get('title'),
                        destination=item.get('destination'),
                        region=item.get('region'),
                        type=item.get('type'),
                        duration=item.get('duration'),
                        nights=item.get('nights'),
                        rating=item.get('rating', 5.0),
                        reviews=item.get('reviews', 0),
                        price=item.get('price'),
                        priceWas=item.get('priceWas'),
                        featured=item.get('featured', False),
                        badge=item.get('badge'),
                        blurb=item.get('blurb'),
                        img=item.get('img'),
                        gallery=item.get('gallery', []),
                        highlights=item.get('highlights', [])
                    )
            self.stdout.write(self.style.SUCCESS('Successfully seeded Packages'))
        else:
            self.stdout.write(self.style.ERROR(f"Packages file not found at {packages_path}"))

        # Seed Destinations
        destinations_path = os.path.join(assets_dir, 'destinations.json')
        if os.path.exists(destinations_path):
            Destination.objects.all().delete()
            with open(destinations_path, 'r') as f:
                data = json.load(f)
                for item in data:
                    Destination.objects.create(
                        name=item.get('name'),
                        count=item.get('count', 0),
                        img=item.get('img'),
                        tag=item.get('tag'),
                        size=item.get('size')
                    )
            self.stdout.write(self.style.SUCCESS('Successfully seeded Destinations'))
        else:
            self.stdout.write(self.style.ERROR(f"Destinations file not found at {destinations_path}"))

        # Seed Offers
        offers_path = os.path.join(assets_dir, 'offers.json')
        if os.path.exists(offers_path):
            Offer.objects.all().delete()
            with open(offers_path, 'r') as f:
                data = json.load(f)
                for item in data:
                    Offer.objects.create(
                        id=item.get('id'),
                        tag=item.get('tag'),
                        title=item.get('title'),
                        sub=item.get('sub'),
                        code=item.get('code'),
                        img=item.get('img'),
                        accent=item.get('accent')
                    )
            self.stdout.write(self.style.SUCCESS('Successfully seeded Offers'))
        else:
            self.stdout.write(self.style.ERROR(f"Offers file not found at {offers_path}"))

        # Seed Testimonials
        testimonials_path = os.path.join(assets_dir, 'testimonials.json')
        if os.path.exists(testimonials_path):
            Testimonial.objects.all().delete()
            with open(testimonials_path, 'r') as f:
                data = json.load(f)
                for item in data:
                    Testimonial.objects.create(
                        quote=item.get('quote'),
                        name=item.get('name'),
                        place=item.get('place'),
                        avatar=item.get('avatar')
                    )
            self.stdout.write(self.style.SUCCESS('Successfully seeded Testimonials'))
        else:
            self.stdout.write(self.style.ERROR(f"Testimonials file not found at {testimonials_path}"))

        # Seed Bookings
        bookings_path = os.path.join(assets_dir, 'bookings.json')
        if os.path.exists(bookings_path):
            Booking.objects.all().delete()
            with open(bookings_path, 'r') as f:
                data = json.load(f)
                for item in data:
                    Booking.objects.create(
                        id=item.get('id'),
                        name=item.get('name'),
                        avatar=item.get('avatar'),
                        pkg=item.get('pkg'),
                        dates=item.get('dates'),
                        total=item.get('total'),
                        status=item.get('status', 'pending')
                    )
            self.stdout.write(self.style.SUCCESS('Successfully seeded Bookings'))
        else:
            self.stdout.write(self.style.ERROR(f"Bookings file not found at {bookings_path}"))
