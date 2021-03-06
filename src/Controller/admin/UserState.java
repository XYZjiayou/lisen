package Controller.admin;

import POJO.JsonData;
import POJO.User;
import ServiceDAO.users.UserServiceDAOImp;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

//========================= ！！！仅用于判断用户的登陆状态，并返回当前登录用户的信息 ！！！ ==================

@WebServlet(name = "UserState", urlPatterns = "/admin/userState")
public class UserState extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserServiceDAOImp usersSD = new UserServiceDAOImp();
    private User user = new User();

    public UserState() {
        super();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //初始化
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=utf8");
        PrintWriter out = response.getWriter();



        // 返回到前端的数据
        ArrayList<User> result = new ArrayList<>();
        boolean success = false;
        String msg = "用户未登录！";

        // 获取session
        HttpSession session = request.getSession(false);      // 若没有获取到session,返回null
        if (session != null) {
            User user = (User) session.getAttribute("user");

            if(user != null && user.getType() > 0){
                result.add(user);
                success = true;
                msg = "用户已登录！";
            }

            System.out.println("User: " + result);
        }

        JsonData JsonData = success ? new JsonData(success, msg, result) : new JsonData(success, msg);
        request.setAttribute("jsonData", JsonData);
        //4.(转)将业务转发到View
        RequestDispatcher rd = request.getRequestDispatcher("/view/ToJSON");
        rd.forward(request, response);

    }
}
