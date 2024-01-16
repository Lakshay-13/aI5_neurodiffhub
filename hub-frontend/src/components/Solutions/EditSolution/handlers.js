import DataService from "../../../services/DataService";

export const handleSaveClick = (event,id, equation,description) => {
    let solution = {
        "equation_id": equation,
        "description": description
    }
    DataService.UpdateSolution(id, solution)
        .then(function (response) {

        })
};