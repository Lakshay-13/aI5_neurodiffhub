import DataService from "../../../services/DataService";

export const handleSaveClick = (id, equation,description,featured) => {
    let solution = {
        "equation_id": equation,
        "description": description,
        "featured":featured
    }
    DataService.UpdateSolution(id, solution)
        .then(function (response) {

        })
};
export const handlePublishClick = (id, history) => {
    DataService.PublishSolution(id)
        .then(function (response) {
            history.push("/admin/solutionsdashboard");
        })
};
export const handleRejectClick = (id, history) => {
    DataService.RejectSolution(id)
        .then(function (response) {
            history.push("/admin/solutionsdashboard");
        })
};