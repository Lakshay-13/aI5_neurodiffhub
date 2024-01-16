import DataService from "../../../services/DataService";

export const handleAddClick = (setAdd, setIndex) => {
    setAdd(true);
    setIndex(false);
};

export const handleEditClick = (loadProjectUser,setAllowEdit,project,pid, setName,setDescrip, setAdd, setIndex, setEdit, setPid) => {

    
    DataService.CheckProjectAccess(project["projectname"])
        .then(function (response) {
            console.log('Means we have permission to edit');
            let project = response.data;
            console.log(project);
            setPid(project["id"]);
            console.log(pid);
            setAdd(false);
            setEdit(true);
            setAllowEdit(true);
            setIndex(false);
            setName(project["projectname"]);
            setDescrip(project["description"]);
            loadProjectUser(project["id"]);
        })
    .catch(err => {
        setAllowEdit(false);
        setPid(project["id"]);
        console.log(pid);
        setAdd(false);
        setIndex(false);
        setName(project["projectname"]);
        setDescrip(project["description"]);
        loadProjectUser(project["id"]); 
        console.log(err);
        //alert("No Access to this Project");
    })
    
        //Catch Error
};
    
export const handleBackClick = (setName, setEdit, setAdd, setIndex, setDescrip,loadProjects) => {
    setAdd(false);
    setIndex(true);
    setEdit(false);
    setName(null);
    setDescrip('');
    loadProjects();
};

