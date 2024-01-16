import AuthService from "../../../services/AuthService";

export const handleSaveClick = (event,username, email, password) => {
    let account = {
        "email": email,
        "password": password
    }
    AuthService.SaveAccount(account)
            .then(function (response) {
                
            })
};