import { verify } from "jsonwebtoken";

const cookieParser = (cookieString) => {
  if (cookieString === "") return {};
  let pairs = cookieString.split(";");
  let splittedPairs = pairs.map((cookie) => cookie.split("="));
  const cookieObj = splittedPairs.reduce(function (obj, cookie) {
    obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(
      cookie[1].trim()
    );

    return obj;
  }, {});

  return cookieObj;
};

const verifyuser = ({ req }) => {
  let studentauth = "";
  const cookieobj = cookieParser(new Headers(req.headers).get("cookie"));
  if (cookieobj["student-auth"]) {
    studentauth = cookieobj["student-auth"]
  }
  return {
    user: verify(cookieobj["user-token"], process.env.NEXTAUTH_SECRET),
    usertype: cookieobj["user-type"],
    userdepartment: cookieobj["user-department"],
    studentauth
  };
};

export default verifyuser;
