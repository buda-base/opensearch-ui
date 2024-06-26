import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import ElasticSearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import moment from "moment";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import {
  BooleanFacet,
  Layout,
  SingleLinksFacet,
  SingleSelectFacet
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new ElasticSearchAPIConnector({
  host:
    process.env.REACT_ELASTICSEARCH_HOST ||
    //"https://search-ui-sandbox.es.us-central1.gcp.cloud.es.io:9243",
    "https://opensearch.bdrc.io",
  index: process.env.REACT_ELASTICSEARCH_INDEX 
    //|| "national-parks",
    || "bdrc_prod",  
    
    /*
  apiKey:
    process.env.REACT_ELASTICSEARCH_API_KEY ||
    "SlUzdWE0QUJmN3VmYVF2Q0F6c0I6TklyWHFIZ3lTbHF6Yzc2eEtyeWFNdw==",
    */

  connectionOptions: {
      headers: {
        "Authorization": "Basic cHVibGljcXVlcnk6MFZzZzFRdmpMa1RDenZ0bA=="
      }
    }
},
(requestBody, requestState, queryConfig) => {
  if(requestBody.query?.bool?.should && !requestBody.query?.bool?.must) {
    requestBody.query.bool.must = requestBody.query.bool.should.filter(q => ["phrase", "phrase_prefix"].includes(q.multi_match?.type))
    delete requestBody.query.bool.should
  }
  console.log("postProcess requestBody Call", requestBody, requestState, queryConfig);
  return requestBody;
});

connector.onAutocomplete = async (
  state,
  queryConfig
) => {
  const response = await fetch(
    "https://autocomplete.bdrc.io/autosuggest", { method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query: state.searchTerm })
    }
  )

  // response will need to be in the shape of AutocompleteResponseState 
  // ==> https://github.com/elastic/search-ui/blob/16c82f84c699ad7134bc11a7dad53294358bb198/packages/search-ui/src/types/index.ts#L70 
  // Alternatively you could transform the response here
  let json = await response.json()
  console.log(json)
  return ({     
    autocompletedResults: [],
    autocompletedSuggestions: {
      documents: json.map((s,i) => ({ 
        highlight: s.res+" <not_suggested><i>/</i> "+s.category+"</not_suggested",
        suggestion: s.res.replace(/<\/?suggested>/g,""),
      }))
    }
  })    
}

// not sure we'll need this 
// ==> https://docs.elastic.co/search-ui/solutions/ecommerce/autocomplete
function AutocompleteView({
  autocompleteResults,
  autocompletedResults,
  autocompleteSuggestions,
  autocompletedSuggestions,
  className,
  getItemProps,
  getMenuProps
}) {
  console.log("complete?",  
    autocompleteResults,
    autocompletedResults,
    autocompleteSuggestions,
    autocompletedSuggestions
  )
  let index = 0;
  return (
    <div
      {...getMenuProps({
        className: ["sui-search-box__autocomplete-container", className].join(
          " "
        )
      })}
    >youpi</div>
  )
}


/*
*/

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    filters: [],
    search_fields: {
      "seriesName_bo_x_ewts": {
        weight:2
      },
      "seriesName_en": {
        weight:2
      },
      "authorshipStatement_bo_x_ewts": {},
      "authorshipStatement_en": {},
      "publisherName_bo_x_ewts": {},
      "publisherLocation_bo_x_ewts": {},
      "publisherName_en": {},
      "publisherLocation_en": {},
      "prefLabel_bo_x_ewts": {
        weight:5
      },
      "prefLabel_en": {
        weight:5
      },
      "comment_bo_x_ewts": {},
      "comment_en": {},
      "altLabel_bo_x_ewts": {
        weight:4
      },
      "altLabel_en": {
        weight:4
      },
      "author.prefLabel_bo_x_ewts": {},
      "author.prefLabel_en": {},
      "translator.prefLabel_bo_x_ewts": {},
      "translator.prefLabel_en": {},
      "workGenre.prefLabel_bo_x_ewts": {},
      "workGenre.prefLabel_en": {},
      "workIsAbout.prefLabel_bo_x_ewts": {},
      "workIsAbout.prefLabel_en": {},
    },
    result_fields: {
      "seriesName_bo_x_ewts":{},
      "seriesName_en":{},
      "authorshipStatement_bo_x_ewts":{},
      "authorshipStatement_en":{},
      "publisherName_bo_x_ewts":{},
      "publisherLocation_bo_x_ewts":{},
      "publisherName_en":{},
      "publisherLocation_en":{},
      "prefLabel_bo_x_ewts":{},
      "prefLabel_en":{},
      "comment_bo_x_ewts":{},
      "comment_en":{},
      "altLabel_bo_x_ewts":{},
      "altLabel_en":{},
      "author.prefLabel_bo_x_ewts":{},
      "author.prefLabel_en":{},
      "translator.prefLabel_bo_x_ewts":{},
      "translator.prefLabel_en":{},
      "workGenre.prefLabel_bo_x_ewts":{},
      "workGenre.prefLabel_en":{},
      "workIsAbout.prefLabel_bo_x_ewts": {},
      "workIsAbout.prefLabel_en": {},
    },
    disjunctiveFacets: [
      /*
      "acres",
      "states.keyword",
      "date_established",
      "location"
      */
    ],
    facets: {
      /*
      "world_heritage_site.keyword": { type: "value" },
      "states.keyword": { type: "value", size: 30, sort: "count" },
      acres: {
        type: "range",
        ranges: [
          { from: -1, name: "Any" },
          { from: 0, to: 1000, name: "Small" },
          { from: 1001, to: 100000, name: "Medium" },
          { from: 100001, name: "Large" }
        ]
      },
      location: {
        // San Francisco. In the future, make this the user's current position
        center: "37.7749, -122.4194",
        type: "range",
        unit: "mi",
        ranges: [
          { from: 0, to: 100, name: "Nearby" },
          { from: 100, to: 500, name: "A longer drive" },
          { from: 500, name: "Perhaps fly?" }
        ]
      },
      date_established: {
        type: "range",
        ranges: [
          {
            from: moment().subtract(50, "years").toISOString(),
            name: "Within the last 50 years"
          },
          {
            from: moment().subtract(100, "years").toISOString(),
            to: moment().subtract(50, "years").toISOString(),
            name: "50 - 100 years ago"
          },
          {
            to: moment().subtract(100, "years").toISOString(),
            name: "More than 100 years ago"
          }
        ]
      },
      visitors: {
        type: "range",
        ranges: [
          { from: 0, to: 10000, name: "0 - 10000" },
          { from: 10001, to: 100000, name: "10001 - 100000" },
          { from: 100001, to: 500000, name: "100001 - 500000" },
          { from: 500001, to: 1000000, name: "500001 - 1000000" },
          { from: 1000001, to: 5000000, name: "1000001 - 5000000" },
          { from: 5000001, to: 10000000, name: "5000001 - 10000000" },
          { from: 10000001, name: "10000001+" }
        ]
      }
      */
    }
  },
  autocompleteQuery: {    
    resultsPerPage: 5,
    suggestions: {
      size: 4
    }
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched }) => ({
          wasSearched
        })}
      >
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchBox
                      autocompleteMinimumCharacters={3}
                      autocompleteResults={{
                        linkTarget: "_blank",
                        sectionTitle: "Results",
                        titleField: "title",
                        urlField: "nps_link",
                        shouldTrackClickThrough: true,
                        clickThroughTags: ["test"]
                      }}
                      autocompleteSuggestions={true}
                      debounceLength={300}
                      //autocompleteView={AutocompleteView}
                    />
                  }
                  sideContent={
                    <div>
                      <Facet
                        field="states.keyword"
                        label="States"
                        filterType="any"
                        isFilterable={true}
                      />
                      <Facet
                        field="world_heritage_site.keyword"
                        label="World Heritage Site"
                        view={BooleanFacet}
                      />
                      <Facet
                        field="visitors"
                        label="Visitors"
                        view={SingleLinksFacet}
                      />
                      <Facet
                        field="date_established"
                        label="Date Established"
                        isFilterable={true}
                        filterType="any"
                      />
                      <Facet
                        field="location"
                        label="Distance"
                        filterType="any"
                      />
                      <Facet field="visitors" label="visitors" />
                      <Facet
                        field="acres"
                        label="Acres"
                        view={SingleSelectFacet}
                      />
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField="title"
                      urlField="nps_link"
                      thumbnailField="image_url"
                      shouldTrackClickThrough={true}
                    />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
