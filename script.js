document.addEventListener("DOMContentLoaded", function() {
    fetch('ledger.json')
    .then(response => response.json())
    .then(data => {
        createTable(data);
        displayEarnings(data);
        displayIndividualEarnings(data);
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
            cell.textContent = rowData[member] ? '✅' : '❌';
            cell.setAttribute('data-member', member);
            cell.setAttribute('data-date', date);
            cell.addEventListener('click', toggleCell);
        });
    });

    tableContainer.appendChild(table);
}

function toggleCell(event) {
    const cell = event.target;
    const member = cell.getAttribute('data-member');
    const date = cell.getAttribute('data-date');

    // Toggle between ✅ and ❌
    cell.textContent = cell.textContent === '✅' ? '❌' : '✅';

    // Update the data in the JSON object
    fetch('ledger.json')
    .then(response => response.json())
    .then(data => {
        data[date][member] = cell.textContent === '✅';
        updateLedger(data);
    })
    .catch(error => {
        console.error('Error updating data:', error);
    });
}

function updateLedger(data) {
    // Send a PUT request to update ledger.json
    fetch('ledger.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log('Ledger updated successfully');
            displayEarnings(data);
            displayIndividualEarnings(data);
        } else {
            console.error('Failed to update ledger:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error updating ledger:', error);
    });
}

function displayEarnings(data) {
    const earningsContainer = document.getElementById('earnings-container');
    const members = Object.keys(data[Object.keys(data)[0]]);
    const earnings = {};

    // Calculate earnings/debt for each member
    members.forEach(member => {
        earnings[member] = 0;
        Object.values(data).forEach(workout => {
            const totalWorkouts = Object.values(workout).filter(value => value).length;
            earnings[member] += totalWorkouts === members.length - 1 ? 1 : 0;
        });
    });

    // Display earnings/debt
    earningsContainer.innerHTML = '<h2>Earnings/Debt</h2>';
    members.forEach(member => {
        const paragraph = document.createElement('p');
        paragraph.textContent = `${member}: $${earnings[member]}`;
        earningsContainer.appendChild(paragraph);
    });
}

function displayIndividualEarnings(data) {
    const individualContainer = document.getElementById('individual-container');
    const members = Object.keys(data[Object.keys(data)[0]]);
    const individualEarnings = {};

    // Calculate individual earnings/debt
    members.forEach(member => {
        individualEarnings[member] = {};
        members.forEach(otherMember => {
            if (otherMember !== member) {
                individualEarnings[member][otherMember] = 0;
                Object.values(data).forEach(workout => {
                    if (!workout[member]) {
                        individualEarnings[member][otherMember] += workout[otherMember] ? 1 : 0;
                    }
                });
            }
        });
    });

    // Display individual earnings/debt
    individualContainer.innerHTML = '<h2>Individual Earnings/Debt</h2>';
    members.forEach(member => {
        const heading = document.createElement('h3');
        heading.textContent = member;
        individualContainer.appendChild(heading);
        Object.keys(individualEarnings[member]).forEach(otherMember => {
            const paragraph = document.createElement('p');
            paragraph.textContent = `${otherMember}: $${individualEarnings[member][otherMember]}`;
            individualContainer.appendChild(paragraph);
        });
    });
}
