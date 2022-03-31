import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import apiAgora from "../../../api";
import { showErrMsg, showSuccessMsg } from "../../../utils/notification";
import {
  isEmpty,
  isEmail,
  isLength,
  isMatch,
  isLengthcontactNumber,
} from "../../../utils/validation";
import styles from "./register.module.css";

import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logos/Programate-academy-negros.png";
import { BsArrowLeftCircle } from "react-icons/bs";

const initialState = {
  firstName: "",
  middleName: "",
  lastName: "",
  secondSurname: "",
  documentType: "",
  documentNumber: "",
  contactNumber: "",
  role: 0,
  email: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

export function RegisterStudent() {
  const params = useParams();
  const cohortID = params.id;
  const [user, setUser] = useState(initialState);
  const [nameCohort, setNameCohort] = useState("");
  const auth = useSelector((state) => state.auth);
  const id_user = auth.user.id;
  const {
    firstName,
    middleName,
    lastName,
    secondSurname,
    documentType,
    documentNumber,
    contactNumber,
    email,
    password,
    cf_password,
    err,
    success,
    role,
  } = user;

  let navigate = useNavigate();

  const fetchCohortName = async (url, id) => {
    const resName = await apiAgora.get(`/api/agora/get-cohort/${url}`, {
      headers: { Authorization: id },
    });
    setNameCohort(resName.data.nameCohort);
  };

  useEffect(() => {
    fetchCohortName(cohortID,id_user);
  }, [cohortID,id_user]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(firstName) || isEmpty(password))
      return setUser({
        ...user,
        err: "Todos los campos son obligatorios",
        success: "",
      });
    if (isEmpty(lastName) || isEmpty(password))
      return setUser({
        ...user,
        err: "Todos los campos son obligatorios",
        success: "",
      });

    if (!isEmail(email))
      return setUser({
        ...user,
        err: "Este correo electronico ya existe :(",
        success: "",
      });

    if (isLengthcontactNumber(contactNumber))
      return setUser({
        ...user,
        err: "El telefono debe tener al menos 10 caracteres",
        success: "",
      });

    if (isLength(password))
      return setUser({
        ...user,
        err: "La contraseña debe tener al menos 6 caracteres",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setUser({
        ...user,
        err: "Las contraseñas no coinciden",
        success: "",
      });

    try {
      if (auth.isAdmin) {
        const res = await apiAgora.post(
          "/api/register_student",
          {
            cohortID,
            firstName,
            middleName,
            lastName,
            secondSurname,
            documentType,
            documentNumber,
            contactNumber,
            email,
            password,
            role,
          },
          {
            headers: { Authorization: id_user },
          }
        );
        showSuccessMsg(success);
        setUser({ ...user, err: "", success: res.data.msg });
      }
    } catch (err) {
      showErrMsg(err.response.data.msg);
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className={styles.container_register}>
      <div className={styles.container_register_page}>
        <button className={styles.button_return} onClick={() => navigate(-1)}>
          <BsArrowLeftCircle size={30} />
        </button>
        <img className={styles.logo_register} src={logo} alt="logo" />
        <h2
          className={styles.title_register}
        >{`Registro Estudiante - Cohorte ${nameCohort}`}</h2>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        <div className={styles.register_form_content}>
          <form className={styles.register_form} onSubmit={handleSubmit}>
            <div className={styles.container_register_input}>
              <div className={styles.input_register}>
                <label>Primer Nomre</label>
                <input
                  placeholder="Primer Nombre"
                  name="firstName"
                  value={firstName}
                  onChange={handleChangeInput}
                />
              </div>
              <div className={styles.input_register}>
                <label>Primer Nomre</label>
                <input
                  label="Segundo nombre"
                  placeholder="Segundo nombre"
                  name="middleName"
                  value={middleName}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className={styles.container_register_input}>
              <div className={styles.input_register}>
                <label>Primer Nomre</label>
                <input
                  label="Primer apellido"
                  placeholder="Primer apellido"
                  name="lastName"
                  value={lastName}
                  onChange={handleChangeInput}
                />
              </div>
              <div className={styles.input_register}>
                <label>Primer Nomre</label>
                <input
                  label="Segundo apellido"
                  placeholder="Segundo apellido"
                  name="secondSurname"
                  value={secondSurname}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className={styles.container_register_input}>
              <div className={styles.input_container}>
                <label className={styles.input_label}>Tipo de Documento</label>
                <select
                  className={styles.form_select}
                  aria-label="Default select example"
                  name="documentType"
                  value={documentType}
                  onChange={handleChangeInput}
                >
                  <option selected>Seleccione...</option>
                  <option value="CC">Cédula de Ciudadania</option>
                  <option value="TI">Tarjeta de Identitdad</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PEP">Permiso Especial de Permanencia</option>
                  <option value="PPT">Permiso de Protección Temporal</option>
                </select>
              </div>
              <div className={styles.input_register}>
                <label>Numero de documento</label>
                <input
                  label="Número de Documento"
                  placeholder="Número de Documento"
                  name="documentNumber"
                  value={documentNumber}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className={styles.container_register_input}>
              <div className={styles.input_register}>
                <label>Correo</label>
                <input
                  label="Correo"
                  placeholder="email@educamas.co"
                  name="email"
                  value={email}
                  onChange={handleChangeInput}
                />
              </div>
              <div className={styles.input_register}>
                <label>Telefono</label>
                <input
                  label="Telefono"
                  placeholder="300 000 00 00"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className={styles.container_register_input}>
              <div className={styles.input_register}>
                <label>Contraseña</label>
                <input
                  type="password"
                  label="Contraseña"
                  placeholder="******"
                  name="password"
                  value={password}
                  onChange={handleChangeInput}
                />
              </div>
              <div className={styles.input_register}>
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  label="Confirmar contraseña"
                  placeholder="******"
                  name="cf_password"
                  value={cf_password}
                  onChange={handleChangeInput}
                />
              </div>
            </div>

            <button className={styles.button_submit_register} type="submit">
              CREAR CUENTA DE ESTUDIANTE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
