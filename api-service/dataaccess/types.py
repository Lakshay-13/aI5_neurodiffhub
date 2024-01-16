from enum import Enum

class AccountType(str, Enum):
    hub = "hub"
    admin = "admin"

class PermissionType(str, Enum):
    read = "read"
    readwrite = "readwrite"
    owner = "owner"

class HubStatusType(str, Enum):
    created = "created"
    submitted = "submitted"
    rejected = "rejected"
    published = "published"

class ProblemType(str, Enum):
    ivp = "ivp"
    bvp = "bvp"
    ibvp = "ibvp"

class DiffEquationType(str, Enum):
    ode = "ode"
    pde = "pde"

class ConditionType(str, Enum):
    ivp = 'ivp'
    ibvp1d = 'ibvp1d'
    dirichletbvp = 'dirichletbvp'
    dirichletbvp2d = 'dirichletbvp2d'

class SolutionSorting(str, Enum):
    likes = "likes"
    created = "created"
    updated = "updated"
    downloads = "downloads"
    alphabetical = "alphabetical"


# Database type Mappings
diff_equation_type_mapping = {
    "Solver1D": DiffEquationType.ode,
    "BundleSolver1D": DiffEquationType.ode,
    "Solver2D": DiffEquationType.pde,
    "UniversalSolver1D": DiffEquationType.ode,
    "UniversalSolver2D": DiffEquationType.pde
}

condition_type_mapping = {
    "IVP": ConditionType.ivp,
    "IBVP1D": ConditionType.ibvp1d,
    "DirichletBVP": ConditionType.dirichletbvp,
    "DirichletBVP2D": ConditionType.dirichletbvp2d
}