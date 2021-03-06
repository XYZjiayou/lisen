package Controller.indexData;

import POJO.JsonData;
import POJO.indexData.EuropeAmerica;
import ServiceDAO.indexData.EuropeAmerica.EuropeAmericaServiceDAOImp;

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
 * Created by user on 2019/12/11
 */
@WebServlet(name ="EuropeAmerica" ,urlPatterns ="/EuropeAmerica/get" )
public class EuropeAmericaGet extends HttpServlet{
    private static final long serialVersion = 1L;

    private EuropeAmericaServiceDAOImp EuropeAmericaDI = new EuropeAmericaServiceDAOImp();
    private EuropeAmerica EuropeAmerica = new EuropeAmerica();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        PrintWriter out = response.getWriter();

        // 设置排序方式
        String areaId = request.getParameter("areaId");   // 区域
        if(areaId!=null && areaId.length()!=0){
            EuropeAmerica.setOrderBy(" WHERE singer.areaId=" + areaId +  " "+"ORDER BY date DESC");
        }else{
            EuropeAmerica.setOrderBy("");
        }

        // （调）2、调用ServiceDAO方法，完成业务
        /**
         * 查询业务
         * 1、调用DAO层的select方法，返回查询到的记录集
         * 2、调用DAO层的count方法，返回查询到的记录数
         */
        ArrayList<EuropeAmerica> result = EuropeAmericaDI.select(EuropeAmerica);
        int count = EuropeAmericaDI.count(EuropeAmerica);

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
