/*
 *
 * 项目名：	com.nio.john.util
 * 文件名：	Charset
 * 模块说明：
 * 修改历史：
 * 2018/3/26 - JOHN - 创建。
 */

package com.nio.john.util;

/**
 * @author JOHN
 * @date 2018/3/26
 */
public enum CHARSET {

    UTF_8("UTF-8");

    private String value;

    private CHARSET(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

}
