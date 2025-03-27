const KEY_LOCAL = "arrNhanVien";
let arrNhanVien = getDataNhanVienLocal();
let arrFilterNhanVien = [];
renderListNhanVien();
// Lấy dữ liệu từ form
function layDuLieuTuForm(form) {
  let formData = new FormData(form);
  let nhanVien = Object.fromEntries(formData);

  return nhanVien;
}

document.getElementById("formQLNV").onsubmit = function (event) {
  event.preventDefault();
  let nhanVien = layDuLieuTuForm(event.target);

  // Check tài khoản hoặc email đã tồn tại
  if (!kiemTraTKVaEmailNV(nhanVien)) return;

  // Check dữ liệu trước khi thêm nhan viên mới vào
  if (!validateNhanVien(nhanVien)) return;

  arrNhanVien.push(nhanVien);
  saveDataNhanVienLocal();
  renderListNhanVien();
  document.getElementById("btnDong").click();
};

function kiemTraTKVaEmailNV(nhanVien) {
  // Kiểm tra nếu tài khoản đã tồn tại
  let index = arrNhanVien.findIndex((nv) => nv.tknv === nhanVien.tknv);
  if (index !== -1) {
    setError("tbTKNV", "Tài khoản đã tồn tại.");
    return false;
  }

  // Kiểm tra nếu email đã tồn tại
  let indexEmail = arrNhanVien.findIndex((nv) => nv.email === nhanVien.email);
  if (indexEmail !== -1) {
    setError("tbEmail", "Email đã tồn tại.");
    return false;
  }

  return true;
}

// render data
function renderListNhanVien(arr = arrNhanVien) {
  // arrNhanVien
  let content = "";
  let theTbody = document.getElementById("tableDanhSach");

  for (let nhanVien of arr) {
    // destructuring để bóc tách
    let { tknv, nameNV, email, password, datepicker, luongCB, chucvu, gioLam } =
      nhanVien;
    let tongLuong = tinhTongLuong(nhanVien);
    let loaiNhanVien = xepLoai(nhanVien);
    content += `
    <tr>
      <td>${tknv}</td>
      <td>${nameNV}</td>
      <td>${email}</td>
      <td>${datepicker}</td>
      <td>${chucvu}</td>
      <td>${tongLuong}</td>
      <td>${loaiNhanVien}</td>
      <td style="display: flex; justify-content: space-between; gap: 10px;border-bottom: none; color: white;">
      <button onclick="xoaNhanVien('${tknv}')" class="btn btn-danger"><i class="fa fa-trash"></i></button>
      <button onclick="suaNhanVien('${tknv}')" class="btn btn-warning" data-toggle="modal" data-target="#myModal"><i class="fa fa-pencil"></i></button>
      </td>
    </tr>
    `;
  }
  theTbody.innerHTML = content;
}

// Hàm save data
function saveDataNhanVienLocal() {
  console.log("Dữ liệu trước khi lưu:", arrNhanVien);
  let dataString = JSON.stringify(arrNhanVien);
  localStorage.setItem(KEY_LOCAL, dataString);
}
// Hàm get data
function getDataNhanVienLocal() {
  let dataLocal = localStorage.getItem(KEY_LOCAL);
  return dataLocal ? JSON.parse(dataLocal) : [];
}
// Xóa sinh viên
function xoaNhanVien(maNV) {
  arrNhanVien = arrNhanVien.filter((sv) => sv.tknv !== maNV);
  saveDataNhanVienLocal();
  renderListNhanVien();
}
// Tính lương nhân viên
function tinhTongLuong(nhanVien) {
  let luong = parseFloat(nhanVien.luongCB);
  let tongLuong = 0;

  switch (nhanVien.chucvu) {
    case "Sếp":
      tongLuong = luong * 3;
      break;
    case "Trưởng phòng":
      tongLuong = luong * 2;
      break;
    default:
      tongLuong = luong;
  }

  return tongLuong.toLocaleString("vi-VN") + " VND";
}
// Xếp loại nhân viên
function xepLoai(nhanVien) {
  let gioLam = parseFloat(nhanVien.gioLam);
  if (gioLam >= 192) {
    return "Nhân viên xuất sắc";
  } else if (gioLam >= 176) {
    return "Nhân viên giỏi";
  } else if (gioLam >= 160) {
    return "Nhân viên khá";
  } else {
    return "Nhân viên trung bình";
  }
}
// Search loại nhân viên
document.getElementById("searchName").oninput = function (event) {
  let keyWord = removeVietnameseTones(event.target.value.trim().toLowerCase());
  // Lọc danh sách nhân viên theo loại nhân viên
  let arrFilter = arrNhanVien.filter((nhanVien) => {
    let loaiNhanVien = xepLoai(nhanVien); // Gọi hàm xếp loại
    let loaiNhanVienKhongDau = removeVietnameseTones(
      loaiNhanVien.toLowerCase()
    );

    return loaiNhanVienKhongDau.includes(keyWord);
  });

  arrFilterNhanVien = arrFilter;
  renderListNhanVien(arrFilterNhanVien);
};

// Sửa dữ liệu nhân viên
function suaNhanVien(msNV) {
  layThongTinSinhVien(msNV);
  document.getElementById("btnCapNhat").setAttribute("data-msnv", msNV);
  document.getElementById("btnThemNV").style.display = "none";
  document.getElementById("btnCapNhat").style.display = "block";
  document.getElementById("btnReset").style.display = "none";
}
function layThongTinSinhVien(msNV) {
  let nhanVien = arrNhanVien.find((item) => item.tknv === msNV);
  if (nhanVien) {
    let arrField = document.querySelectorAll(
      "#formQLNV input, #formQLNV select"
    );
    for (let field of arrField) {
      // Lấy ra từng thẻ trong HTML
      // console.log(field);
      let { name } = field;
      // console.log("Name:", field.name);
      field.value = nhanVien[name];
      if (name == "tknv") {
        field.readOnly = true;
      }
    }
  }
}
document.getElementById("btnCapNhat").onclick = function () {
  let msNV = this.getAttribute("data-msnv");
  let form = document.getElementById("formQLNV");
  let nhanVienMoi = layDuLieuTuForm(form);

  // Kiểm tra email trùng khi cập nhật (ngoại trừ email đã có trước đó)
  let indexEmail = arrNhanVien.findIndex(
    (nv) => nv.email === nhanVienMoi.email && nv.tknv !== msNV
  );
  if (indexEmail !== -1) {
    setError("tbEmail", "Email đã tồn tại.");
    return;
  }

  // Kiểm tra điều kiện trước khi cập nhật
  if (!validateNhanVien(nhanVienMoi)) return;

  // Cập nhật nhân viên trong mảng
  let index = arrNhanVien.findIndex((nv) => nv.tknv === msNV);
  if (index !== -1) {
    arrNhanVien[index] = nhanVienMoi;
    saveDataNhanVienLocal();
    renderListNhanVien();
    document.getElementById("btnDong").click();
  }
};

// Hàm kiểm tra điều kiện Validation
function validateNhanVien(nhanVien) {
  let isValid = true;

  // Reset tất cả thông báo lỗi trước khi kiểm tra
  document
    .querySelectorAll(".sp-thongbao")
    .forEach((span) => (span.innerText = ""));

  // Kiểm tra tài khoản (4-6 ký số)
  if (!/^\d{4,6}$/.test(nhanVien.tknv)) {
    setError("tbTKNV", "Tài khoản phải có từ 4 đến 6 ký số.");
    isValid = false;
  }

  // Kiểm tra tên nhân viên (chỉ chứa chữ cái)
  if (!/^[A-Za-zÀ-ỹ\s]+$/.test(nhanVien.nameNV)) {
    setError("tbTen", "Tên nhân viên chỉ được chứa chữ cái.");
    isValid = false;
  }

  // Kiểm tra email hợp lệ
  if (!/^\S+@\S+\.\S+$/.test(nhanVien.email)) {
    setError("tbEmail", "Email không hợp lệ.");
    isValid = false;
  }

  // Kiểm tra mật khẩu (6-10 ký tự, gồm số, chữ hoa, ký tự đặc biệt)
  if (
    !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/.test(
      nhanVien.password
    )
  ) {
    setError(
      "tbMatKhau",
      "Mật khẩu 6-10 ký tự, gồm số, chữ hoa và ký tự đặc biệt."
    );
    isValid = false;
  }

  // Kiểm tra ngày làm (mm/dd/yyyy hoặc yyyy-mm-dd)
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(nhanVien.datepicker)) {
    setError("tbNgay", "Ngày làm phải theo định dạng mm/dd/yyyy.");
    isValid = false;
  }

  // Xử lý lương: Loại bỏ khoảng trắng trước khi kiểm tra
  nhanVien.luongCB = nhanVien.luongCB.replace(/\s/g, "");
  let luong = parseFloat(nhanVien.luongCB);
  if (isNaN(luong) || luong < 1000000 || luong > 20000000) {
    setError("tbLuongCB", "Lương phải từ 1.000.000 đến 20.000.000.");
    isValid = false;
  }

  // Kiểm tra chức vụ (phải chọn đúng giá trị)
  if (!["Sếp", "Trưởng phòng", "Nhân viên"].includes(nhanVien.chucvu)) {
    setError("tbChucVu", "Chọn chức vụ hợp lệ.");
    isValid = false;
  }

  // Kiểm tra giờ làm (80 - 200 giờ)
  let gioLam = parseFloat(nhanVien.gioLam);
  if (isNaN(gioLam) || gioLam < 80 || gioLam > 200) {
    setError("tbGiolam", "Giờ làm phải từ 80 đến 200 giờ.");
    isValid = false;
  }

  return isValid;
}

function setError(id, message) {
  let element = document.getElementById(id);

  element.innerText = message;
  element.style.display = "block";
  element.style.color = "red";
  element.style.fontWeight = "bold";
  element.style.marginTop = "6px";
}
// button Đóng
document.getElementById("btnDong").addEventListener("click", function () {
  document.getElementById("formQLNV").reset();
  document.getElementById("tknv").readOnly = false;
  document.querySelectorAll(".sp-thongbao").forEach((span) => {
    span.innerText = "";
  });
});
// button thêm
document.getElementById("btnThem").addEventListener("click", function () {
  document.getElementById("formQLNV").reset();
  document.getElementById("tknv").readOnly = false;
  document.getElementById("btnThemNV").style.display = "block";
  document.getElementById("btnCapNhat").style.display = "none";
  document.getElementById("btnReset").style.display = "block";
});
// button reset
document.getElementById("btnReset").addEventListener("click", function () {
  document.getElementById("formQLNV").reset();
  document.getElementById("tknv").readOnly = false;

  // Xóa tất cả thông báo lỗi nếu có
  document.querySelectorAll(".sp-thongbao").forEach((span) => {
    span.innerText = "";
    span.style.display = "none"; // Ẩn lỗi
  });
});
// Tắt mở password
function togglePassword() {
  let passwordField = document.getElementById("password");
  let icon = document.getElementById("toggleIcon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    passwordField.type = "password";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
}
