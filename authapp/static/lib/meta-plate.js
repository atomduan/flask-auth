function edit_table_button_click() {
	var obj = {};
	obj.apply_id = $("#apply_id").val();
	obj.table_id = $("#table_id").val();
	obj.reviewer_id = $("#reviewer_id").val();
	obj.host_id = $("#host_id").val();
	obj.db_id = $("#db_id").val();
	obj.name = $("#name").val();
	obj.comments = $("#comments").val();
	obj.apply_desc = $("#apply_desc").val();
	obj.fields = [];
	$("#fields_table").find("tr").each(function(){
		var ele = {};	
		ele.id = $(this).find("#id").val();	
		ele.name = $(this).find("#name").val();	
		ele.field_type = $(this).find("#field_type").val();	
		ele.is_primary = $(this).find("#is_primary").val();	
		ele.is_partition = $(this).find("#is_partition").val();	
		ele.comments = $(this).find("#comments").val();	
		obj.fields.push(ele);
	});
	jsonStr = JSON.stringify(obj);
	$("#form_json_text").val(jsonStr);
	$("#edit_table_form").attr("action","edit_table?operate=submit")
	$("#edit_table_form").submit()
}

function deleteTr(nowTr){ 
	$(nowTr).parent().parent().remove(); 
}

function show_modify_principal_form(pid) {
	mod_input(pid, "opt");
	mod_input(pid, "res");
	mod_input(pid, "rol");
	mod_opert(pid);
}

function modify_principal(pid) {
	var obj = {};
	//clean first
	$("#form_json_text").val("");
	obj.principal_id=pid;
	obj.opt_principal = $("#opt_"+pid).val();
	obj.res_principal = $("#res_"+pid).val();
	obj.rol_principal = $("#rol_"+pid).val();
	jsonStr = JSON.stringify(obj);
	$("#form_json_text").val(jsonStr);
	$("#modify_principal_form").attr("action","modify_principal");
	$("#modify_principal_form").submit();
}

function mod_opert(pid) {
	spid = "#p_"+pid;
	$(spid).find("#opt").html("<a onclick='modify_principal("
			+pid+")'>提交</a> / <a href=''>取消</a>");
}

function mod_input(pid, ipt) {
	spid = "#p_"+pid;
	ipt_id = "#"+ipt+"_p";
	var content = $(spid).find(ipt_id).html();
	$(spid).find(ipt_id) .html("<input type='text' id="
			+ipt+"_"+pid+" class='input' value='"+content+"'/>");
}

function add_principal(role_id) {
	var tr = "<tr>"
		+"<td>New</td>"
		+"<td><input type=text id=opt_x></td>"
		+"<td><input type=text id=res_x></td>"
		+"<td><input type=text id=rol_x></td>"
		+"<td>None</td>"
		+"<td><a onclick='authorize(this, "+role_id+")'>提交</a> / <a href=''>取消</a></td>"
		+"</tr>";
	$("#principals").append(tr);
}

function authorize(ele, role_id) {
	obj = {};
	var tr = $(ele).parent().parent();
	obj.opt_principal = $(tr).find("#opt_x").val();	
	obj.res_principal = $(tr).find("#res_x").val();	
	obj.rol_principal = $(tr).find("#rol_x").val();	
	obj.role_id = role_id;
	jsonStr = JSON.stringify(obj);
	$("#authorize_text").val(jsonStr);
	$("#authorize_form").attr("action","authorize");
	$("#authorize_form").submit();
}
