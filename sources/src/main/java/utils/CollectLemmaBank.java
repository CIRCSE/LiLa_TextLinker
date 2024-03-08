package utils;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Multimap;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class CollectLemmaBank {
    public static  Multimap<String, Integer> getLemmas(){
        Multimap<String, Integer> lemmi = ArrayListMultimap.create();
        Multimap<String, String> lemmiWrPos = ArrayListMultimap.create();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(
                    "jdbc:mysql://127.0.0.1:3306/lila_db?Unicode=true&characterEncoding=UTF8&autoreconnect=true&cachePrepStmts=true&useServerPrepStmts=true&serverTimezone=UTC", "your_user", "your_password");

            PreparedStatement pstm = con.prepareStatement("select * from lemmaDet");
            ResultSet results = pstm.executeQuery();
            while (results.next()) {
                for (String l : results.getString("wrList").split(",")) {
                    lemmiWrPos.put(l, results.getString("upostag"));
                    lemmi.put(l + "_" + results.getString("upostag"), results.getInt("id_lemma"));
                }
            }
            con.close();
        }catch (Exception e){
            e.printStackTrace();
        }
        return lemmi;
    }


    public static  Multimap<String, Integer> getIpoLemmas(){
        Multimap<String, Integer> ipolemmi = ArrayListMultimap.create();
        Multimap<String, String> ipolemmiWrPos = ArrayListMultimap.create();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(
                    "jdbc:mysql://127.0.0.1:3306/lila_db?Unicode=true&characterEncoding=UTF8&autoreconnect=true&cachePrepStmts=true&useServerPrepStmts=true&serverTimezone=UTC",  "your_user", "your_password");

            PreparedStatement pstm = con.prepareStatement("select * from ipolemmaDet inner join ipolemma_wrList on ipolemmaDet.id_ipolemma=ipolemma_wrList.id_ipolemma and (ipolemmaDet.type NOT IN('COMP', 'SUP') or ipolemmaDet.id_ipolemma IN (SELECT id_ipolemma FROM hypolemmaCompSup) )");
            ResultSet results = pstm.executeQuery();

            while (results.next()) {
                for (String l : results.getString("wrList").split(",")) {
                    ipolemmiWrPos.put(l, results.getString("upostag"));
                    ipolemmi.put(l + "_" + results.getString("upostag"), results.getInt("id_ipolemma"));
                }
            }
            con.close();
        }catch (Exception e){
            e.printStackTrace();
        }
        return ipolemmi;
    }


}
