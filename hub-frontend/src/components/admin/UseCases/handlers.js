import DataService from "../../../services/DataService";

export const handleAddClick = (setAdd, setIndex) => {
    setAdd(true);
    setIndex(false);
};
export const handleEditClick = (item, setName, setAdd, setIndex) => {
    setIndex(false);
    setAdd(false);
    setName(item["name"]);
};
export const handleDeleteClick = (item) => {
    
};
export const handleCancelClick = (setName, setAdd, setIndex) => {
    setAdd(false);
    setIndex(true);
    setName('');
};
export const handleSaveClick = (event,name, add, setName, setAdd, setIndex, loadUseCases) => {
    let use_case = {
        "name": name
    }
    DataService.CreateUseCase(use_case)
        .then(function (response) {
            let use_case = response.data;
            setAdd(false);
            setIndex(true);
            setName('');
            loadUseCases();

        })
};