let currentOperation;

// change displayed input fields depending on selected database operation
$("#operation").change(() => {
    // determine selected database operation
    currentOperation = $("#operation option:selected").attr("value");
    console.log("Selected Database Operation: " + currentOperation);

    // show only the ID input when operation is get or delete
    if (currentOperation === "get" || currentOperation === "delete") {
        $(".getAll-op").removeClass("hidden");
        $(".insert-delete-op").addClass("hidden");
    }

    // show no input field when operation is getAll
    if (currentOperation === "getAll") {
        $(".getAll-op").addClass("hidden");
    }

    // show all input fields when operation is insert or update
    if (currentOperation === "add" || currentOperation === "update") {
        $(".getAll-op").removeClass("hidden");
        $(".insert-delete-op").removeClass("hidden");
    }

    $("#data-display").addClass("hidden");
    $("#error-display").addClass("hidden");
});

$("#submit-btn").click(async (e) => {
    e.preventDefault();

    $("#data-display").addClass("hidden")
    $("#error-display").addClass("hidden");

    if (currentOperation === "add") {
        const data = formToObject();
        console.log("add operation, got:", data);
        const response = await fetch("/appointments/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                     throw new Error("Error adding appointment");
                }
                return response.text();
            })
            .then((data) => {
                console.log(data);

                const displayMessage = $("<div>")
                    .addClass("p-4 text-sm text-green-800 rounded-lg bg-gray-300 dark:bg-green-400 dark:text-green-950")
                    .attr("role", "alert")
                    .html("<span class='font-medium'>Success:</span> Appointment has successfully been added.");

                $("#error-display").html(displayMessage);
                $("#error-display").removeClass("hidden");
            })
            .catch((error) => {
                console.error(error);

                const errorMessage = $("<div>")
                    .addClass("p-4 text-sm text-red-800 rounded-lg bg-gray-400 dark:bg-red-400 dark:text-red-950")
                    .attr("role", "alert")
                    .html("<span class='font-medium'>Error:</span> An error occurred while adding the appointment. Please try again.");

                $("#error-display").html(errorMessage);
                $("#error-display").removeClass("hidden");
            });
        console.log(response);
    }

    if (currentOperation === "delete") {
        const formData = formToObject();
        const apptId = formData["id"];
        console.log("delete operation, got:", apptId);
        const response = await fetch(`/appointments/delete/${apptId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                     throw new Error("Error deleting appointment");
                }
                return response.text();
            })
            .then((data) => {

                console.log(data);

                const displayMessage = $("<div>")
                    .addClass("p-4 text-sm text-green-800 rounded-lg bg-gray-300 dark:bg-green-400 dark:text-green-950")
                    .attr("role", "alert")
                    .html("<span class='font-medium'>Success:</span> Appointment has successfully been deleted.");

                $("#error-display").html(displayMessage);
                $("#error-display").removeClass("hidden");
            })
            .catch((error) => {

                console.error(error);

                const errorMessage = $("<div>")
                    .addClass("p-4 text-sm text-red-800 rounded-lg bg-gray-400 dark:bg-red-400 dark:text-red-950")
                    .attr("role", "alert")
                    .html("<span class='font-medium'>Error:</span> An error occurred while deleting the appointment. Please try again.");

                $("#error-display").html(errorMessage);
                $("#error-display").removeClass("hidden");
            });
        console.log(response);
    }

    if (currentOperation === "update") {
        const data = formToObject();
        console.log("update operation, got:", data);
        const response = await fetch(`/appointments/update/${data["id"]}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                console.log(response)
                if (!response.ok) {
                     throw new Error("Error updating appointment");
                }
                return response.text();
            })
            .then((data) => {

                console.log(data);

                const displayMessage = $("<div>")
                    .addClass("p-4 text-sm text-green-800 rounded-lg bg-gray-300 dark:bg-green-400 dark:text-green-950")
                    .attr("role", "alert")
                    .html("<span class='font-medium'>Success:</span> Appointment has successfully been updated.");

                $("#error-display").html(displayMessage);
                $("#error-display").removeClass("hidden");
            })
            .catch((error) => {

                console.error(error);

                const errorMessage = $("<div>")
                    .addClass("p-4 text-sm text-red-800 rounded-lg bg-gray-400 dark:bg-red-400 dark:text-red-950")
                    .attr("role", "alert")
                    .html("<span class='font-medium'>Error:</span> An error occurred while updating the appointment. Please try again.");

                $("#error-display").html(errorMessage);
                $("#error-display").removeClass("hidden");
            });
        console.log(response);
    }

    if (currentOperation === "getAll") {
      console.log("getAll operation");
      const response = await fetch("/appointments/getAll", {
          method: "GET",
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error("Error fetching data");
              }
              return response.json();
          })
          .then(appointments => {
              console.log("Appointments received:", appointments);

              const tableContainer = $("<div>").addClass("px-4");
              const table = $("<table>").addClass("text-sm text-left rtl:text-right mt-1 overflow-x-auto overflow-y-auto h-screen");
              tableContainer.append(table);

              const thead = $("<thead>").addClass("text-xs text-black uppercase rounded border-b dark:text-black");
              const headerRow = $("<tr>");

              const headerLabels = ["Appointment ID", "Status", "Time Queued", "Queue Date", "Start Time", "End Time", "Appointment Type", "Virtual", "Patient Age", "Patient Gender", "Clinic/Hospital Name", "Clinic is Hospital", "Clinic City", "Clinic Province", "Clinic Region Name", "Doctor Main Specialty", "Doctor Age"];
              $.each(headerLabels, function(index, label) {
                  $("<th>").text(label).addClass("px-6 py-3").appendTo(headerRow);
              });

              headerRow.appendTo(thead);
              thead.appendTo(table);

              const tbody = $("<tbody>").attr("id", "appointments-list");
              $.each(appointments, function(index, appointment) {
                  const row = $("<tr>").addClass("border-b hover:bg-gray-300");

                  const appointmentAttributes = ["id", "status", "timequeued", "queuedate", "starttime", "endtime", "appttype", "isvirtual", "px_age", "px_gender", "clinic_hospitalname", "clinic_ishospital", "clinic_city", "clinic_province", "clinic_regionname", "doctor_mainspecialty", "doctor_age"];

                  $.each(appointmentAttributes, function(index, attr) {
                      $("<td>").text(appointment[attr]).addClass("px-6 py-4").appendTo(row);
                  });

                  tbody.append(row);
              });

              table.append(tbody);

              $("#data-display").empty().append(table);
              $("#data-display").removeClass("hidden");
          })
           .catch((error) => {

              console.error(error);

              const errorMessage = $("<div>")
                  .addClass("p-4 text-sm text-red-800 rounded-lg bg-gray-400 dark:bg-red-400 dark:text-red-950")
                  .attr("role", "alert")
                  .html("<span class='font-medium'>Error:</span> An error occurred while finding all appointments. Please try again.");

              $("#error-display").html(errorMessage);
              $("#error-display").removeClass("hidden");
          });

    }

    if (currentOperation === "get") {
          console.log("get operation");
          const data = formToObject();
          const response = await fetch(`/appointments/${data.id}`, {
              method: "GET",
              })
              .then(response => {
                  if (!response.ok) {
                      throw new Error("Error fetching data");
                  }
                  return response.json();
              })
              .then(appointment => {
                  console.log("Appointment received:", appointment);

                  const tableContainer = $("<div>").addClass("px-4");
                  const table = $("<table>").addClass("text-sm text-left rtl:text-right mt-1 overflow-x-auto overflow-y-auto h-0.5");
                  tableContainer.append(table);

                  const thead = $("<thead>").addClass("text-xs text-black uppercase rounded border-b dark:text-black");
                  const headerRow = $("<tr>");

                  const headerLabels = ["Appointment ID", "Status", "Time Queued", "Queue Date", "Start Time", "End Time", "Appointment Type", "Virtual", "Patient Age", "Patient Gender", "Clinic/Hospital Name", "Clinic is Hospital", "Clinic City", "Clinic Province", "Clinic Region Name", "Doctor Main Specialty", "Doctor Age"];

                  $.each(headerLabels, function(index, label) {
                      $("<th>").text(label).addClass("px-6 py-3").appendTo(headerRow);
                  });

                  headerRow.appendTo(thead);
                  thead.appendTo(table);

                  const tbody = $("<tbody>").attr("id", "appointments-list");

                  const row = $("<tr>").addClass("border-b hover:bg-gray-300");

                  const appointmentAttributes = ["id", "status", "timequeued", "queuedate", "starttime", "endtime", "appttype", "isvirtual", "px_age", "px_gender", "clinic_hospitalname", "clinic_ishospital", "clinic_city", "clinic_province", "clinic_regionname", "doctor_mainspecialty", "doctor_age"];

                  $.each(appointmentAttributes, function(index, attr) {
                      $("<td>").text(appointment[attr]).addClass("px-6 py-4").appendTo(row);
                  });
                  tbody.append(row);

                  table.append(tbody);

                  $("#data-display").empty().append(table);
                  $("#data-display").removeClass("hidden");
              })
              .catch((error) => {

                console.error(error);

                const errorMessage = $("<div>")
                    .addClass("p-4 text-sm text-red-800 rounded-lg bg-gray-400 dark:bg-red-400 dark:text-red-950")
                    .attr("role", "alert")
                    .html("<span class='font-medium'>Error:</span> An error occurred while finding this appointment. Please try again.");

                $("#error-display").html(errorMessage);
                $("#error-display").removeClass("hidden");
              });

    }
});

function formToObject() {
    return {
        id: $("#id").val(),
        status: $("#status").val(),
        timequeued: $("#timequeued").val(),
        queuedate: $("#queuedate").val(),
        starttime: $("#starttime").val(),
        endtime: $("#endtime").val(),
        appttype: $("#appttype").val(),
        isvirtual: $("#isvirtual").val(),
        px_age: $("#px_age").val(),
        px_gender: $("#px_gender").val(),
        clinic_hospitalname: $("#clinic_hospitalname").val(),
        clinic_ishospital: $("#clinic_ishospital").val(),
        clinic_city: $("#clinic_city").val(),
        clinic_province: $("#clinic_province").val(),
        clinic_regionname: $("#clinic_regionname").val(),
        doctor_mainspecialty: $("#doctor_mainspecialty").val(),
        doctor_age: $("#doctor_age").val(),
    };
}
