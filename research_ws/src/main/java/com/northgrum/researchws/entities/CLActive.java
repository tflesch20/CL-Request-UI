package com.northgrum.researchws.entities;

import java.io.Serializable;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 * @author tflesch
 * 
 * CREATE DATE: 2019 JULY 8
 * PURPOSE:
 * NOTES:
 * ============================================================================================================================================
 * CHANGE HISTORY
 * ============================================================================================================================================
 */
@Entity
@Table(name="CL_ACTIVE")
public class CLActive implements Serializable {

	private static final long serialVersionUID = 1;

	private int id;
	private String requestTag;
	private String requestValue;
	private String requestTagLevel2;
	private String requestValueLevel2;
	private int edited;
	
	@Id
	@SequenceGenerator(name="active_gen", sequenceName="CLOGIC.ACTIVE_SEQ", allocationSize = 1)
	@GeneratedValue(strategy=GenerationType.AUTO, generator="active_gen")
	@Column(name="ID")
	public int getID() {
		return id;
	}
	public void setID(int id) {
		this.id = id;
	}

	@Column(name="REQUEST_TAG")
	public String getRequestTag() {
		return requestTag;
	}
	public void setRequestTag(String requestTag) {
		this.requestTag = requestTag;
	}

	@Column(name="REQUEST_VALUE")
	public String getRequestValue() {
		return requestValue;
	}
	public void setRequestValue(String requestValue) {
		this.requestValue = requestValue;
	}

	@Column(name="REQUEST_TAG_LEVEL_2")
	public String getRequestTagLevel2() {
		return requestTagLevel2;
	}
	public void setRequestTagLevel2(String requestTagLevel2) {
		this.requestTagLevel2 = requestTagLevel2;
	}

	@Column(name="REQUEST_VALUE_LEVEL_2")
	public String getRequestValueLevel2() {
		return requestValueLevel2;
	}
	public void setRequestValueLevel2(String requestValueLevel2) {
		this.requestValueLevel2 = requestValueLevel2;
	}

	@Column(name="EDITED")
	public int getEdited() {
		return edited;
	}
	public void setEdited(int edited) {
		this.edited = edited;
	}
}
