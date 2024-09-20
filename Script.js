document.addEventListener('DOMContentLoaded', function() {
    // API endpoint
    const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev';

    // Basic Auth credentials
    const username = 'coalition';
    const password = 'skills-test';
    const credentials = btoa(`${username}:${password}`); // Encoding the credentials

    // Fetching data using Basic Auth
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${credentials}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Log the full response to understand the structure
        console.log('API Response:', data);

        // Check if the data is an array
        if (Array.isArray(data)) {
            // Find the specific patient (Jessica Taylor)
            const patient = data.find(p => p.name === 'Jessica Taylor');

            if (patient) {
                console.log('Patient Data:', patient);

                // Populate patient details
                document.getElementById('patient-name').textContent = patient.name;
                document.getElementById('patient-age').textContent = patient.age;
                document.getElementById('patient-gender').textContent = patient.gender;

                // Populate the patient's profile picture
                const profilePictureElement = document.getElementById('patient-profile-picture');
                if (profilePictureElement) {
                    profilePictureElement.src = patient.profile_picture;
                    profilePictureElement.alt = `${patient.name}'s Profile Picture`;
                }

                // Extract blood pressure data from diagnosis_history
                const bloodPressure = patient.diagnosis_history.map(diagnosis => ({
                    date: `${diagnosis.month} ${diagnosis.year}`,
                    systolic: diagnosis.blood_pressure.systolic.value,
                    diastolic: diagnosis.blood_pressure.diastolic.value
                }));

                // Log the blood pressure data to ensure it's correct
                console.log('Blood Pressure Data:', bloodPressure);

                if (bloodPressure.length > 0) {
                    // Prepare data for the chart
                    const labels = bloodPressure.map(bp => bp.date);
                    const systolicValues = bloodPressure.map(bp => bp.systolic);
                    const diastolicValues = bloodPressure.map(bp => bp.diastolic);

                    // Log labels and values to verify them
                    console.log('Chart Labels:', labels);
                    console.log('Systolic Values:', systolicValues);
                    console.log('Diastolic Values:', diastolicValues);

                    // Create the chart
                    const ctx = document.getElementById('blood-pressure-chart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Systolic',
                                    data: systolicValues,
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    fill: false,
                                    tension: 0.4 // Smooth curves
                                },
                                {
                                    label: 'Diastolic',
                                    data: diastolicValues,
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    fill: false,
                                    tension: 0.4 // Smooth curves
                                }
                            ]
                        },
                        options: {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Date'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Blood Pressure (mmHg)'
                                    },
                                    min: 50,
                                    max: 180
                                }
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top'
                                }
                            }
                        }
                    });
                } else {
                    console.error('No blood pressure data available for Jessica Taylor.');
                    alert('No blood pressure data available for Jessica Taylor.');
                }
            } else {
                console.error('Jessica Taylor not found in the patient data.');
            }
        } else {
            console.error('Data is not an array.');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});
