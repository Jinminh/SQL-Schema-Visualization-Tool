#!/usr/bin/python
import re
import sys
import glob
import os
import json

table_name = ''
global if_table
if_table = False
# global col_counter = 0

def match_table_name(str):
    match = table_name_pattern.search(str)
    if match:
        global table_name
        global if_table
        if_table = True
        table_name = re.findall(r'"\S+"', str)[0].strip('\"')
        
        
def match_column_name(str):
    global if_table
    key_pair = {}
    if if_table == False:
        return
    match = column_name_pattern.search(str)
    if match:
        col_names = re.findall(r'"\S+"', str)
#         fk_list.append(col_names[0].strip('\"'))
        key_pair['fk_name'] = col_names[0].strip('\"')
        if len(col_names) > 1:
              key_pair['referenced_column_name'] = col_names[1].strip('\"')
#             print col_names[1]
        else:
            key_pair['referenced_column_name'] = col_names[0].strip('\"')
        fk_list[key_pair['fk_name']] = key_pair
            


# def match_ref_table(str):
    
#     global bool_match_ref_table
#     if(not bool_match_ref_table):
#         return
#     match = ref_table_name_pattern.search(str)
#     if match:
#         ref_table_name = re.findall(r'\s+\S+\s*;', str)[0].strip().strip(';')
        
#         if(re.findall('<.+>', ref_table_name)):
#             ref_table_name = re.findall('<.+>', ref_table_name)[0].strip('>').strip('<')
            
#         list_last_index = len(fk_list) - 1
#         fk_list[list_last_index]['ref_table_name'] = ref_table_name
#         bool_match_ref_table = False


if __name__ == "__main__":
    path = sys.argv[1]
    table_list = {}
    for f_name in glob.glob(os.path.join(path, '*.java')):
#         print filename        
        fo = open(f_name)
        
        table = {}
        table_name_pattern = re.compile(r'@Table(\S+)')

        column_name_pattern = re.compile('@JoinColumn')    

        fk_list = {}

        for line in fo:
            match_table_name(line)
            match_column_name(line)  
            
        if not fk_list:
            continue
        
#         table[table_name] = fk_list     
#         table[table_name] = list(set(fk_list))   
        table_list[table_name] = list(fk_list[key] for key in fk_list)
    
        if_table = False
        
    t_list = json.dumps(table_list)  
    
    print(t_list)
    
    sys.stdout.flush()
           
