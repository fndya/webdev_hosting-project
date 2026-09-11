from datetime import datetime

from django import template

from hosting.models import TariffFeature

register = template.Library()

@register.simple_tag
def current_year():
    return datetime.now().year

@register.simple_tag(takes_context=True)
def current_path(context):
    request = context["request"]
    return request.path

@register.simple_tag
def get_features():
    return TariffFeature.objects.all()
