import pytest

#from utils import equations
import equations


@pytest.mark.asyncio
async def test_parse_string():

    eq = equations.parse_string('[diff(u, t) - (alpha*u  - beta*u*v), diff(v, t) - (delta*u*v - gamma*v)], ')

    assert eq == ['\\frac{d (u)}{d t}-(\\alpha u  - \\beta uv) = 0', '\\frac{d (v)}{d t}-(\\delta uv - \\gamma v) = 0']

    eq2 = equations.parse_string('lambda u,v,t: [diff(u,t,order=1) - v, diff(v,t) + alpha*v + beta*u + delta*u*u*u - gamma*torch.cos(omega*t), ]')
    
    assert eq2 == ['\\frac{d (u)}{d t}-v = 0', '\\frac{d (v)}{d t}+\\alpha v+\\beta u+\\delta uuu-\\gamma cos(\\omega t) = 0']
    
    eq3 = equations.parse_string('[diff(p, t) + diff(p*(a*x - b*x**3) + 2, x) - (s**2/2)*diff(p, x, order=2)]')
    
    assert eq3 == ['\\frac{\\partial (p)}{\\partial t}+\\frac{\\partial (p(ax - bx^3) + 2)}{\\partial x}-(s^2/2)\\frac{\\partial^2(p)}{\\partial  x^2} = 0']
    
    eq4 = equations.parse_string('lambda u, x, t: [diff(u, t) - k * diff(u, x, order=2)]')
    
    assert eq4 == ['\\frac{\\partial (u)}{\\partial t}-k\\frac{\\partial^2(u)}{\\partial  x^2} = 0']

    eq5 = equations.parse_string('lambda u,t : [diff(u,t) + u]')
    
    assert eq5 == ['\\frac{d (u)}{d t}+u = 0']
    
    eq6 = equations.parse_string('lambda u,t : diff(u,t) + u')
    
    assert eq6 == ['\\frac{d (u)}{d t}+u = 0']

    eq7 = equations.parse_string('diff(u, t, order=2) + u')
    
    assert eq7 == ['\\frac{d^2(u)}{d  t^2}+u = 0']

#def test_parse_string2():

    #eq = equations.parse_string('[diff(u, t) - (alpha*u  - beta*u*v), diff(v, t) - (delta*u*v - gamma*v)], ')

    #assert eq == ['\\frac{d (u)}{d t}-(\\alpha u  - \\beta uv) = 0', '\\frac{d (v)}{d t}-(\\delta uv - \\gamma v) = 0']

    #eq2 = equations.parse_string('lambda u,v,t: [diff(u,t,order=1) - v, diff(v,t) + alpha*v + beta*u + delta*u*u*u - gamma*torch.cos(omega*t), ]')
    
    #assert eq2 == ['\\frac{d (u)}{d t}-v = 0', '\\frac{d (v)}{d t}+\\alpha v+\\beta u+\\delta uuu-\\gamma cos(\\omega t) = 0']
    
    #eq3 = equations.parse_string('[diff(p, t) + diff(p*(a*x - b*x**3) + 2, x) - (s**2/2)*diff(p, x, order=2)]')
    
    #assert eq3 == ['\\frac{\\partial (p)}{\\partial t}+\\frac{\\partial (p(ax - bx^3) + 2)}{\\partial x}-(s^2/2)\\frac{\\partial^2(p)}{\\partial  x^2} = 0']
    
    #eq4 = equations.parse_string('lambda u, x, t: [diff(u, t) - k * diff(u, x, order=2)]')
    
    #assert eq4 == ['\\frac{\\partial (u)}{\\partial t}-k\\frac{\\partial^2(u)}{\\partial  x^2} = 0']

    #eq5 = equations.parse_string('lambda u,t : [diff(u,t) + u]')
    
    #assert eq5 == ['\\frac{d (u)}{d t}+u = 0']
    
    #eq6 = equations.parse_string('lambda u,t : diff(u,t) + u')
    
    #assert eq6 == ['\\frac{d (u)}{d t}+u = 0']

    #eq7 = equations.parse_string('diff(u, t, order=2) + u')
    
    #assert eq7 == ['\\frac{d^2(u)}{d  t^2}+u = 0']

    #eq8 = equations.parse_string('lambda u, t: [diff(u, t, order=2) + (5*diff(u, t, order=1)) + 6*u]', debug=True)
    
    #assert eq7 == ['\\frac{d^2(u)}{d  t^2}+u = 0']
    
    #eq9 = equations.parse_string('lambda u, t: [diff(u, t, order=2) + (0.3*diff(u, t, order=1)) -u + (u**3) - (0.2*torch.cos(t))', debug=True)

    #eq10 = equations.parse_string('lambda u, t: [diff(u, t, order=2) + (0.3*diff(u, t, order=1)) -u + (u**3) - (0.2*torch.sin(t))]', debug=True)

#test_parse_string2()

# def test_this_parses(eqn):
#     equations.parse_string(eqn,debug=True)

#lambda u, t: [diff(u, t, order=2) + (5*diff(u, t, order=1)) + 6*u]

# ODE & ODE System Examples

# 1. 'lambda u, t: [diff(u, t, order=2) + (5*diff(u, t, order=1)) + 6*u]'
# 2. 'diff(u, t, order=2) + u'
# 3. 'lambda u,t : diff(u,t) + u'
# 4. 'lambda u,t : [diff(u,t) + u]'
# 5. "lambda u, t: [diff(u, t, order=2) + (0.3*diff(u, t, order=1)) -u + (u**3) - (0.25*torch.cos(t))]"
# 6. "lambda u, t: [diff(u, t, order=2) + (0.3*diff(u, t, order=1)) -u + (u**3) - (0.2*torch.cos(t))]"
# 7. "def lotka_volterra(u, v, t): return [diff(u, t) - (alpha*u - beta*u*v),diff(v, t) - (delta*u*v - gamma*v), ]"
# 8. "lambda u, t: [diff(u, t) - 0.1*u*(1-u)]"
# 9. "lambda u, t: [diff(u, t, order=2) + (0.3*diff(u, t, order=1)) -u + (u**3) - (0.2*torch.sin(t))]"
# 10. "def ode_system(u, v, t):return [diff(u,t)-(u-u*v), diff(v,t)-(u*v-v)]"
# 11. "lambda u,t : [diff(u,t) + u]"
# 12. "def lotka_volterra(u, v, t): return [diff(u, t) - (alpha*u - beta*u*v),diff(v, t) - (delta*u*v - gamma*v), ]"
# 13. "lambda u,v,t : [diff(u,t) - v, diff(v,t) + alpha*v + beta*u + delta*u*u*u - gamma*torch.cos(omega*t)]"
# 14. "def ode_pendulum(u, t):return [diff(u, t, order=2) + torch.sin(u),]"
# 15. '[diff(u, t) - (alpha*u  - beta*u*v), diff(v, t) - (delta*u*v - gamma*v)], '

#If single indpendent variable, then d2u, no brackets
#test_this_parses('lambda u, t: [diff(u, t, order=2) + (5*diff(u, t, order=1)) + 6*u]')
#test_this_parses('3*diff(u, t, order=2) + u')
#test_this_parses('lambda u,t : diff(u,t) + 3**u')
#test_this_parses('lambda u,t : [diff(u,t) + u]')
#test_this_parses("lambda u, t: [diff(u, t, order=2) + (0.3*diff(u, t, order=1)) -u + (u**3) - (0.25*torch.cos(t))]")
#test_this_parses("lambda u, t: [diff(u, t, order=2) + (0.3*diff(u, t, order=1)) -u + (u**3) - (0.2*torch.cos(t))]")
#test_this_parses("def lotka_volterra(u, v, t): return [diff(u, t) - (alpha*u - beta*u*v),diff(v, t) - (delta*u*v - gamma*v), ]")
#test_this_parses("lambda u, t: [diff(u, t) - 0.1*u*(1-u)]")
#test_this_parses("lambda u, t: [diff(u, t, order=2) + (0.3*diff(u, t, order=1)) -u + (u**3) - (0.2*torch.sin(t))]")
#test_this_parses("def ode_system(u, v, t):return [diff(u,t)-(u-u*v), diff(v,t)-(u*v-v)]")
#test_this_parses("lambda u,t : [diff(u,t) + u]")
#test_this_parses("def lotka_volterra(u, v, t): return [diff(u, t) - (alpha*u - beta*u*v),diff(v, t) - (delta*u*v - gamma*v), ]")
#test_this_parses("lambda u,v,t : [diff(u,t) - v, diff(v,t) + alpha*v + beta*u + delta*u*u*u - gamma*torch.cos(omega*t)]") #u*u*u will be an issue
#test_this_parses("def ode_pendulum(u, t):return [diff(u, t, order=2) + torch.sin(u),]")
#test_this_parses('[diff(u, t) - (alpha*u  - beta*u*v), diff(v, t) - (delta*u*v - gamma*v)], ')