"use client";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showSuccess = (message) => {
  MySwal.fire({
    icon: "success",
    title: "Success",
    text: message,
    timer: 3000,
    showConfirmButton: false,
  });
};

export const showError = (message) => {
  MySwal.fire({
    icon: "error",
    title: "Error",
    text: message,
    timer: 3000,
    showConfirmButton: false,
  });
};

export const showWarning = (message) => {
  MySwal.fire({
    icon: "warning",
    title: "Warning",
    text: message,
    timer: 3000,
    showConfirmButton: false,
  });
};

export const showInfo = (message) => {
  MySwal.fire({
    icon: "info",
    title: "Info",
    text: message,
    timer: 3000,
    showConfirmButton: false,
  });
};

export const showDeleteConfirm = (title, text) => {
  return MySwal.fire({
    icon: "warning",
    title: title || "Are you sure?",
    text: text || "You won't be able to revert this!",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });
};