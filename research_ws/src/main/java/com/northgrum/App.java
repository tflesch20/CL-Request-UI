package com.northgrum;

import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooby.Jooby;
import org.jooby.Results;
import org.jooby.apitool.ApiTool;
import org.jooby.hbm.Hbm;
import org.jooby.jdbc.Jdbc;
import org.jooby.json.Jackson;

import com.northgrum.researchws.entities.CLActive;
import com.northgrum.researchws.entities.CLChange;
import com.northgrum.researchws.route.Operations;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

import org.jooby.handlers.Cors;
import org.jooby.handlers.CorsHandler;

/**
 * @author bwatts
 * 
 * CREATE DATE: 2018 APR 13
 * PURPOSE:
 * NOTES:
 * ============================================================================================================================================
 * CHANGE HISTORY
 * ============================================================================================================================================
 */
public class App extends Jooby {

	private static final Logger logger = LogManager.getLogger(App.class);

	{
		/** Render JSON: */
		use(new Jackson());
		logger.info("Using Jackson...");

		/** CORS !!! */
		use("*", new CorsHandler(new Cors()));
		logger.info("Handling CORS...");

		
		
		use(new Jdbc("db"));
		logger.info("Connecting to DB...");

		use(new Hbm().classes(CLActive.class, CLChange.class));
		logger.info("Using Hibernate Database object mappings...");

		use(new Operations());

		logger.info("Building Documents API...");

		{
			use(new ApiTool().swagger("/swagger").raml("/raml"));
		}

	}

	public static void main(final String[] args) {
		run(App::new, args);
	}

}