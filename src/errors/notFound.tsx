import AlertBox from "../components/common/Alerts/Alerts";

const NotFoundPage = () => {
  return (
    <AlertBox message="Sorry, the page you requested could not be found." type="warning" />
  );
}

export default NotFoundPage;
