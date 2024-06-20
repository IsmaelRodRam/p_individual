document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('modo1').addEventListener('click', 
    function(){
        sessionStorage.removeItem("save");
        window.location.assign("./html/menumodo1.html");
    });

    document.getElementById('modo2').addEventListener('click', 
    function(){
        sessionStorage.removeItem("save");
        window.location.assign("./html/menumodo2.html");
    });
});