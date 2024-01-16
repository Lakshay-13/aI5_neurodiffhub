import AuthService from "../../../services/AuthService";

export const handleAddClick = (event, callback) => {
    AuthService.CreateAPIKey()
            .then(function (response) {
                callback();
            })
};
export const handleDeleteClick = (event,id, callback) => {
    AuthService.DeleteAPIKey(id)
            .then(function (response) {
                callback();
            })
};