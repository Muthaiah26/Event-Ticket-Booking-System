document.getElementById('bookingform').addEventListener('submit',function(e){
    const noOfTickets=document.getElementById('noOfTickets').ariaValueMax;
    if(noOfTickets <=0){
        e.preventDefault();
        alert('please enter a valid number of tickets...');
    }
});