import { useMemo, useState } from "react";
import FormInput from "../components/formik/FormInput";
import * as Yup from "yup";
import "yup-phone-lite";
import {
  faCarAlt,
  faMobileAlt,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import CheckBoxInput from "../components/formik/CheckBoxInput";
import Submit from "../components/formik/Submit";
import client from "../api/client";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  phone_number: Yup.string()
    .phone("GH", "Not a valid Ghanaian number")
    .required()
    .label("Phone Number"),
  expected_date_time: Yup.string().required().label("Expected Date and Time"),
  vehicle_license_plate: Yup.string().label("Vehicle License Plate"),
});

function VisitorReg() {
  const [has_car, setHasCar] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const getOriginalId = (id) => {
    return id.replace(/_/g, " ");
  };

  const onSubmit = async (form, { resetForm }) => {
    setLoading(true);
    const extra = has_car ? {} : { vehicle_license_plate: "" };
    try {
      const { data } = await client.post(
        "/registerVisitor",
        {
          ...form,
          ...extra,
          has_car,
          user_id: getOriginalId(id),
        },
        {
          headers: {
            Authorization: getOriginalId(id),
          },
        }
      );
      toast.success("Registered Successfully", {
        position: "top-left",
      });
      resetForm();
      console.log(data);
    } catch (error) {
      toast.error("Registration Failed", {
        position: "top-left",
      });
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex bg-gray-100 text-gray-700 flex-col h-[100vh] overflow-y-scroll items-center md:justify-center">
        {/* <div className="p-10 border w-full h-[100vh] md:h-auto md:w-auto border-gray-300 bg-white shadow-lg rounded"> */}
        <div className="flex justify-center md:items-center border -md:h-[100vh] -md:w-full border-gray-300 bg-white shadow-lg rounded">
          <div className="p-10">
            <div
              style={{ fontFamily: "Quicksand" }}
              className="text-blue-800/70 font-semibold text-center text-lg -md:mt-10 mb-10"
            >
              Visitor Registration
            </div>
            <Formik
              initialValues={{
                name: "",
                phone_number: "",
                expected_date_time: "",
                vehicle_license_plate: "",
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <>
                <FormInput
                  name={"name"}
                  label={"Please enter your name"}
                  placeholder={"Name"}
                  icon={faPerson}
                />
                <FormInput
                  name={"phone_number"}
                  label={"Please enter your phone number"}
                  placeholder={"Phone Number"}
                  icon={faMobileAlt}
                />
                <FormInput
                  name={"expected_date_time"}
                  label={"Please select the date and time of visit"}
                  placeholder={"Expected date and time"}
                  type={"datetime-local"}
                  // icon={faCalendar}
                />
                {has_car && (
                  <FormInput
                    name={"vehicle_license_plate"}
                    label={"Please enter your vehicle license plate"}
                    placeholder={"Vehicle License Plate"}
                    icon={faCarAlt}
                  />
                )}
                <CheckBoxInput
                  name={"has_car"}
                  label={"Check this box if you have a car"}
                  checked={has_car}
                  onChange={(e) => {
                    setHasCar(e.target.checked);
                  }}
                />
                <Submit text={loading ? "LOADING.." : "Submit"} />
              </>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export default VisitorReg;
