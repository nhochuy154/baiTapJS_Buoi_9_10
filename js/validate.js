// Kiểm tra dữ liệu có rỗng không, nếu rỗng thì sẽ return về false, đồng thời hiện thị thông báo lỗi
export function isEmpty(value, spanError, errorMsg) {
  if (value.trim() === "") {
    spanError.innerHTML = errorMsg;
    return false;
  } else {
    spanError.innerHTML = "";
    return true;
  }
}

export function isNumber(value, spanError, errorMsg, min, max) {
  if (value.trim() === "") return;
  let numvalue = Number(value);
  if (isNaN(numvalue) === false) {
    if (numvalue < min || numvalue > max) {
      spanError.innerHTML = `Vui lòng nhập giá trị trong khoảng từ ${min} đến ${max}`;
      return false;
    } else {
      spanError.innerHTML = "";
      return true;
    }
  } else {
    spanError.innerHTML = errorMsg;
    return false;
  }
}

export function checkPassword(value, spanError, errorEmptyMsg) {
  if (value.trim() === "") return;
  let regPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/; // Regular Expression => Regex
  let checkPassword = regPassword.test(value);
  // console.log("checkPassword: ", checkPassword);
  if (checkPassword === false) {
    spanError.innerHTML = errorEmptyMsg;
    return false;
  } else {
    spanError.innerHTML = "";
    return true;
  }
}

export function checkEmail(value, spanError, errorEmptyMsg) {
  if (value.trim() === "") return;
  let regEmail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
  let checkEmail = regEmail.test(value);
  if (checkEmail === false) {
    spanError.innerHTML = errorEmptyMsg;
    return false;
  } else {
    spanError.innerHTML = "";
    return true;
  }
}

// Có 2 cách export function
// Cách 1: export từng function
//  -- Cú pháp: export { functionName1, functionName2, ...}

// Cách 2: export deafault
// --Cú pháp: export
