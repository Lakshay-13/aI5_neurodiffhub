from fastapi import APIRouter

from dataaccess.types import DiffEquationType, HubStatusType, ConditionType, condition_type_mapping

router = APIRouter()


@router.get(
    "/enums",
    tags=["Enums"],
    summary="Get all enums",
    description="Get all enums"
)
async def get_enums():

    hub_status_types = {
        HubStatusType.created: "Created",
        HubStatusType.submitted: "Submitted",
        HubStatusType.rejected: "Rejected",
        HubStatusType.published: "Published"
    }

    diff_equation_types = {
        DiffEquationType.ode: "ODE",
        DiffEquationType.pde: "PDE"
    }
    diff_equation_types_long = {
        DiffEquationType.ode: "Ordinary Differential Equation (ODE)",
        DiffEquationType.pde: "Partial Differential Equation (PDE)"
    }

    condition_types = {
        ConditionType.ivp: "IVP",
        ConditionType.ibvp1d: "IBVP 1D",
        ConditionType.dirichletbvp: "Dirichlet BVP",
        ConditionType.dirichletbvp2d: "Dirichlet BVP 2D"
    }

    return {
        "diff_equation_types": diff_equation_types,
        "diff_equation_types_long": diff_equation_types_long,
        "hub_status_types": hub_status_types,
        "condition_types": condition_types,
        "condition_type_mapping": condition_type_mapping
    }
