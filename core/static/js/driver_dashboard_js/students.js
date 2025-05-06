document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addStudentForm');
    const tableBody = document.getElementById('studentTableBody');
  
    let students = [];
  
    function renderTable() {
      tableBody.innerHTML = '';
      students.forEach((student, index) => {
        const row = document.createElement('tr');
  
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${student.first_name}</td>
          <td>${student.last_name}</td>
          <td>${student.route_number}</td>
          <td>${student.seat_number || '-'}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1 edit-btn" data-id="${index}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${index}">Delete</button>
          </td>
        `;
  
        tableBody.appendChild(row);
      });
  
      attachButtonListeners();
    }
  
    function attachButtonListeners() {
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const student = students[id];
  
          const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
          form.querySelector('input[name="first_name"]').value = student.first_name;
          form.querySelector('input[name="last_name"]').value = student.last_name;
          form.querySelector('input[name="route_number"]').value = student.route_number;
          form.querySelector('input[name="seat_number"]').value = student.seat_number || '';
          form.dataset.editId = id;
          modal.show();
        });
      });
  
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          if (confirm('Are you sure you want to delete this student?')) {
            students.splice(id, 1);
            renderTable();
          }
        });
      });
    }
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const data = {
        first_name: form.first_name.value.trim(),
        last_name: form.last_name.value.trim(),
        route_number: form.route_number.value.trim(),
        seat_number: form.seat_number.value.trim()
      };
  
      if (form.dataset.editId) {
        students[form.dataset.editId] = data;
        delete form.dataset.editId;
      } else {
        students.push(data);
      }
  
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
      renderTable();
    });
  
    // Initial table render (empty)
    renderTable();
  });
  