from datetime import datetime

from django import template

from hosting.models import Tariff

register = template.Library()

@register.simple_tag
def current_year():
    return datetime.now().year

@register.simple_tag(takes_context=True)
def current_path(context):
    request = context["request"]
    return request.path

@register.simple_tag
def get_recommended_tariffs():
    return Tariff.active.filter(
        is_recommended=True
    )

