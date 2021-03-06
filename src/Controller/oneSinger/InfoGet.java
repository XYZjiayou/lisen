package Controller.oneSinger;


import POJO.Album;
import POJO.JsonData;
import POJO.Singer;
import ServiceDAO.onesinger.OneSingerServiceDAOImp;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

/**
 *
 */
@WebServlet(name ="InfoGet" ,urlPatterns ="/info/get" )
public class InfoGet extends HttpServlet {
    private static final long serialVersion = 1L;

    private OneSingerServiceDAOImp singerSDI = new OneSingerServiceDAOImp();
    private Singer singer = new Singer();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        PrintWriter out = response.getWriter();


        // （参）1、获取参数值保存到POJO对象中
        // 设置查询条件
        String search = request.getParameter("search");
        if(search!=null && search.length()!=0){
            // 模糊查找teacher的name、sequence
            singer.setCondition(" singer.name = '"+search+"'  or singer.img= '"+search+"' or  area.name='"+search+"' or style.name='"+search+"' or singer.py='"+search+"'");
        }else{
            singer.setCondition("");
        }
        // 设置分页
        String page = request.getParameter("page");     // 页数
        String size = request.getParameter("size");     // 每页显示的数据大小
        if(page!=null && page.length()!=0 && size!=null && size.length()!=0){
            int p = Integer.parseInt(page);
            int r = Integer.parseInt(size);
            singer.setLimit(" limit " + (p-1)*r + "," + r);
        }else{
            singer.setLimit("");
        }
        // 设置排序方式
        String field = request.getParameter("field");   // 排序字段
        String order = request.getParameter("order");   // 排序方式 升序 或 降序
        if(field!=null && field.length()!=0 && order!=null && order.length()!=0){
            singer.setOrderBy(" order by " + field + " " + order);
            singer.setOrderBy("");
        }else{
        }

        // （调）2、调用ServiceDAO方法，完成业务
        /**
         * 查询业务
         * 1、调用DAO层的select方法，返回查询到的记录集
         * 2、调用DAO层的count方法，返回查询到的记录数
         */
        ArrayList<Singer> result = singerSDI.select(singer);
        int count = singerSDI.count(singer);


        // （存）3、将数据对象存储到request中
        boolean success;    // 操作成功与否
        String msg;         // 返回结果信息
        if(result.size()==0 || count==-1){
            success = false;
            msg = "查询失败！";
        }else{
            success = true;
            msg = "查询成功！";
        }
        JsonData jsonData = new JsonData(success,msg,count,result);
        request.setAttribute("jsonData",jsonData);

        // 校验数据
        System.out.println(jsonData);


        // （转）4、将业务转发给View
        RequestDispatcher rd = request.getRequestDispatcher("/view/ToJSON");
        rd.forward(request,response);
    }
    
    
}
