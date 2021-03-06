package Controller.indexData;

import POJO.JsonData;
import POJO.indexData.SongHits;
import ServiceDAO.indexData.SongHits.SongHitsServiceDAOImp;

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
 * Created by user on 2019/12/12
 */
@WebServlet(name ="SongHits" ,urlPatterns ="/SongHits/get" )
public class SongHitsGet extends HttpServlet{
    private static final long serialVersion = 1L;

    private SongHitsServiceDAOImp SongHitsDI = new SongHitsServiceDAOImp();
    private SongHits SongHits = new SongHits();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        PrintWriter out = response.getWriter();

        // 设置排序方式
        String hits = request.getParameter("hits");   // 排序字段
        String order2 = request.getParameter("order2");   // 排序方式 升序 或 降序
        if(hits!=null && hits.length()!=0 && order2!=null && order2.length()!=0){
            SongHits.setOrderBy(" order by " + hits + " " + order2);
        }else{
            SongHits.setOrderBy("");
        }


        // 设置限制条数
        String limit = request.getParameter("limit");
        if(limit!=null && limit.length()!=0){
            SongHits.setLimit(" limit " + limit);
        }else{
            SongHits.setLimit("");
        }

        // （调）2、调用ServiceDAO方法，完成业务
        /**
         * 查询业务
         * 1、调用DAO层的select方法，返回查询到的记录集
         * 2、调用DAO层的count方法，返回查询到的记录数
         */
        ArrayList<SongHits> result = SongHitsDI.select(SongHits);
        int count = SongHitsDI.count(SongHits);

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

        // （转）4、将业务转发给View
        RequestDispatcher rd = request.getRequestDispatcher("/view/ToJSON");
        rd.forward(request,response);
    }
}
