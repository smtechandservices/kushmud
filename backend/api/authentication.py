from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings
from api.models import Customer


class StaffJWTAuthentication(JWTAuthentication):
    """Default authentication for admin/staff endpoints. Rejects customer-scoped tokens
    so a customer account can never be confused with a staff User sharing the same id."""

    def get_user(self, validated_token):
        if validated_token.get('scope') == 'customer':
            raise AuthenticationFailed('Customer tokens cannot access staff endpoints.', code='wrong_token_scope')
        return super().get_user(validated_token)


class CustomerJWTAuthentication(JWTAuthentication):
    """Authentication for customer-facing endpoints. Only accepts customer-scoped tokens."""

    def get_user(self, validated_token):
        if validated_token.get('scope') != 'customer':
            raise AuthenticationFailed('Staff tokens cannot access customer endpoints.', code='wrong_token_scope')
        try:
            user_id = validated_token[api_settings.USER_ID_CLAIM]
        except KeyError:
            raise AuthenticationFailed('Token contained no recognizable customer identification')
        try:
            return Customer.objects.get(id=user_id, is_active=True)
        except Customer.DoesNotExist:
            raise AuthenticationFailed('Customer not found or inactive.', code='customer_not_found')


class StaffOrCustomerJWTAuthentication(JWTAuthentication):
    """Accepts either a staff- or customer-scoped token, dispatching the user lookup based on
    the token's own scope claim. Used for endpoints both kinds of accounts can hit (e.g. a
    customer submitting a story, alongside staff creating one directly in the admin)."""

    def get_user(self, validated_token):
        if validated_token.get('scope') == 'customer':
            try:
                user_id = validated_token[api_settings.USER_ID_CLAIM]
            except KeyError:
                raise AuthenticationFailed('Token contained no recognizable customer identification')
            try:
                return Customer.objects.get(id=user_id, is_active=True)
            except Customer.DoesNotExist:
                raise AuthenticationFailed('Customer not found or inactive.', code='customer_not_found')
        return super().get_user(validated_token)
