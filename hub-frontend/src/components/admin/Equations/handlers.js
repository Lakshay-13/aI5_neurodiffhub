import DataService from "../../../services/DataService";

export const handleAddClick = (setAdd, setIndex) => {
    setAdd(true);
    setIndex(false);
};
export const handleEditClick = (item, setName, setDescription, setAdd, setIndex) => {
    setIndex(false);
    setAdd(false);
    setName(item["name"]);
    setDescription(item["description"]);
};
export const handleDeleteClick = (item) => {
    
};
export const handleCancelClick = (setName, setAdd, setIndex) => {
    setAdd(false);
    setIndex(true);
    setName('');
};
export const handleSaveClick = (event,name,description, add, setName,setDescription, setAdd, setIndex, loadEquations) => {
    let equation = {
        "name": name,
        "description": description
    }
    DataService.CreateEquation(equation)
        .then(function (response) {
            let equation = response.data;
            setAdd(false);
            setIndex(true);
            setName('');
            setDescription('');
            loadEquations();

        })
};