alert('JavaScript is working!');

document.addEventListener('DOMContentLoaded', function() {
    alert('DOM loaded!');
    
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        alert('Drop zone found!');
        dropZone.onclick = function() {
            alert('Drop zone clicked!');
        };
    } else {
        alert('Drop zone NOT found!');
    }
});