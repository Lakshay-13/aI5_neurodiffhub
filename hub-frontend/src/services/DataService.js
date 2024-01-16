import { BASE_API_URL } from "./Common";
import { authHeader } from "./AuthService";

const axios = require('axios');

const DataService = {
    Init: function () {
        // Any application initialization logic comes here
    },
    GetSolutions: async function (return_count, sort_by, search, equation_types,
        problem_types, condition_types, equation_ids, use_case_ids, domain_t_min, domain_t_max, domain_x_min, domain_x_max, domain_y_min, domain_y_max) {
        let url = "/solutions";
        if (return_count) {
            url += "?return_count=true";
        } else {
            url += "?return_count=false";
        }
        if (sort_by) {
            url += "&sort_by=" + sort_by;
        }
        if (equation_types) {
            url += "&equation_types=" + equation_types;
        }
        if (problem_types) {
            url += "&problem_types=" + problem_types;
        }
        if (condition_types) {
            url += "&condition_types=" + condition_types;
        }
        if (equation_ids) {
            url += "&equations=" + equation_ids;
        }
        if (use_case_ids) {
            url += "&use_cases=" + use_case_ids;
        }
        if (search && search != '') {
            url += "&q=" + search;
        }
        if (domain_t_min) {
            url += "&domain_t_min=" + domain_t_min;
        }
        if (domain_t_max) {
            url += "&domain_t_max=" + domain_t_max;
        }
        if (domain_x_min) {
            url += "&domain_x_min=" + domain_x_min;
        }
        if (domain_x_max) {
            url += "&domain_x_max=" + domain_x_max;
        }
        if (domain_y_min) {
            url += "&domain_y_min=" + domain_y_min;
        }
        if (domain_y_max) {
            url += "&domain_y_max=" + domain_y_max;
        }
        return await axios.get(BASE_API_URL + url, { headers: authHeader() });
    },
    GetFeaturedSolutions: async function () {
        return await axios.get(BASE_API_URL + "/solutions?featured=true", { headers: authHeader() });
    },
    GetUserSolutions: async function (username) {
        return await axios.get(BASE_API_URL + "/solutions?username=" + username, { headers: authHeader() });
    },
    GetMySolutions: async function () {
        return await axios.get(BASE_API_URL + "/solutions?my=true", { headers: authHeader() });
    },
    GetSubmittedSolutions: async function () {
        return await axios.get(BASE_API_URL + "/solutions?status=submitted", { headers: authHeader() });
    },
    GetPublishedSolutions: async function () {
        return await axios.get(BASE_API_URL + "/solutions?status=published", { headers: authHeader() });
    },
    GetSolution: async function (id) {
        return await axios.get(BASE_API_URL + "/solutions/" + id, { headers: authHeader() });
    },
    GetSolutionVersions: async function (id) {
        return await axios.get(BASE_API_URL + "/solutions/versions?id=" + id, { headers: authHeader() });
    },
    CheckSolutionAccess: async function (id) {
        return await axios.get(BASE_API_URL + "/solutions/access/" + id, { headers: authHeader() });
    },
    UpdateSolution: async function (id, solution) {
        return await axios.put(BASE_API_URL + "/solutions/" + id, solution, { headers: authHeader() });
    },
    SubmitSolution: async function (id, comment) {
        return await axios.put(BASE_API_URL + "/solutions/" + id + "/submit", { "comment": comment }, { headers: authHeader() });
    },
    PublishSolution: async function (id, comment) {
        return await axios.put(BASE_API_URL + "/solutions/" + id + "/publish", { "comment": comment }, { headers: authHeader() });
    },
    RejectSolution: async function (id, comment) {
        return await axios.put(BASE_API_URL + "/solutions/" + id + "/reject", { "comment": comment }, { headers: authHeader() });
    },
    DeleteSolution: async function (id) {
        return await axios.delete(BASE_API_URL + "/solutions/" + id, { headers: authHeader() });
    },
    GetTopContributors: async function () {
        return await axios.get(BASE_API_URL + "/solutions/top_contributors", { headers: authHeader() });
    },
    GetHubStatusHistory: async function (id) {
        return await axios.get(BASE_API_URL + "/solutions/hub_status_history?id=" + id, { headers: authHeader() });
    },
    GetUseCases: async function () {
        return await axios.get(BASE_API_URL + "/use_cases", { headers: authHeader() });
    },
    GetUseCase: async function (id) {
        return await axios.get(BASE_API_URL + "/use_cases/" + id, { headers: authHeader() });
    },
    CreateUseCase: async function (use_case) {
        return await axios.post(BASE_API_URL + "/use_cases", use_case, { headers: authHeader() });
    },
    UpdateUseCase: async function (use_case) {
        return await axios.put(BASE_API_URL + "/use_cases", use_case, { headers: authHeader() });
    },
    GetEquations: async function () {
        return await axios.get(BASE_API_URL + "/equations", { headers: authHeader() });
    },
    GetEquation: async function (id) {
        return await axios.get(BASE_API_URL + "/equations/" + id, { headers: authHeader() });
    },
    CreateEquation: async function (equation) {
        return await axios.post(BASE_API_URL + "/equations", equation, { headers: authHeader() });
    },
    UpdateEquation: async function (equation) {
        return await axios.put(BASE_API_URL + "/equations", equation, { headers: authHeader() });
    },
    GetUserProfile: async function (username) {
        return await axios.get(BASE_API_URL + "/profile/" + username, { headers: authHeader() });
    },
    GetUserInfo: async function (user_id) {
        return await axios.get(BASE_API_URL + "/userinfo?id=" + user_id, { headers: authHeader() });
    },
    GetProjects: async function () {
        return await axios.get(BASE_API_URL + "/projects", { headers: authHeader() });
    },
    CreateProject: async function (project) {
        return await axios.post(BASE_API_URL + "/projects", project, { headers: authHeader() });
    },
    UpdateProject: async function (id, project) {
        return await axios.put(BASE_API_URL + "/projects/" + id, project, { headers: authHeader() });
    },
    GetProject: async function (id) {
        return await axios.get(BASE_API_URL + "/projects/" + id, { headers: authHeader() });
    },
    DeleteProject: async function (id) {
        return await axios.delete(BASE_API_URL + "/projects/" + id, { headers: authHeader() });
    },
    DeleteProjectUser: async function (user_name, projectid) {
        return await axios.put(BASE_API_URL + "/projects/remove_users/" + user_name, projectid, { headers: authHeader() });
    },
    UpdateProjectUser: async function (user_name, project) {
        return await axios.put(BASE_API_URL + "/projects/update_users/" + user_name, project, { headers: authHeader() });
    },

    CheckProjectAccess: async function (projectname) {
        return await axios.get(BASE_API_URL + "/projects/check_access/" + projectname, { headers: authHeader() });
    },
    NotifyProjectChange: async function (project_notify) {
        return await axios.post(BASE_API_URL + "/projects/notification", project_notify, { headers: authHeader() });
    },
    NotifyProjectDetails: async function (project_details) {
        return await axios.post(BASE_API_URL + "/projects/details_notification", project_details, { headers: authHeader() });
    },
    SearchProjects: async function (q) {
        return await axios.get(BASE_API_URL + "/projects?q=" + q, { headers: authHeader() });
    },
    GetUsersByType: async function (account_type) {
        return await axios.get(BASE_API_URL + "/users?account_type=" + account_type, { headers: authHeader() });
    },
    SearchUsers: async function (q) {
        return await axios.get(BASE_API_URL + "/users?q=" + q, { headers: authHeader() });
    },
    AddAdmin: async function (username) {
        return await axios.post(BASE_API_URL + "/add_admin/" + username, {}, { headers: authHeader() });
    },
    RemoveAdmin: async function (username) {
        return await axios.post(BASE_API_URL + "/remove_admin/" + username, {}, { headers: authHeader() });
    },
}

export default DataService;