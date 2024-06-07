document.addEventListener("DOMContentLoaded", function() {
    fetch('ledger.json')
    .then(response => response.json())
    .then(data => {
        createTable(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});

function createTable(data) {
    const tableContainer = document.getElementById('table-container');
    const dates = Object.keys(data);
    const members = Object.keys(data[dates[0]]);

    const table = document.createElement('table');
    const headerRow = table.insertRow();
    
    // Create headers
    const dateHeader = document.createElement('th');
    dateHeader.textContent = 'Date';
    headerRow.appendChild(dateHeader);

    members.forEach(member => {
        const memberHeader = document.createElement('th');
        memberHeader.textContent = member;
        headerRow.appendChild(memberHeader);
    });

    // Create rows and cells
    dates.forEach(date => {
        const rowData = data[date];
        const row = table.insertRow();
        
        const dateCell = row.insertCell();
        dateCell.textContent = date;

        members.forEach(member => {
            const cell = row.insertCell();
            cell.textContent = rowData[member];
        });
    });

    tableContainer.appendChild(table);
}

