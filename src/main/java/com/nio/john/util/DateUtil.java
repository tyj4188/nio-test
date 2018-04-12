/*
 *
 * 项目名：	com.nio.john.util
 * 文件名：	DateUtil
 * 模块说明：
 * 修改历史：
 * 2018/4/10 - JOHN - 创建。
 */

package com.nio.john.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author JOHN
 * @date 2018/4/10
 */
public class DateUtil {

    /**
     * 日期格式，年月日时分秒，年月日用横杠分开，时分秒用冒号分开
     * 例如：2005-05-10 23：20：00，2008-08-08 20:08:08
     */
    public static final String DATE_TIME_FORMAT_YYYY_MM_DD_HH_MI_SS = "yyyy-MM-dd HH:mm:ss";

    public static String dateToString(Date date, String pattern) {
        DateFormat dateFormat = new SimpleDateFormat(pattern);
        return dateFormat.format(date);
    }
}
