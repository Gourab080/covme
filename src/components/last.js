import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

function Last() {
    return (
        <div className="lastupdated">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                  <Paper>
                      <div className="text-right text-xs mb-2">
                                        <h2 className="">Last Updated</h2>
                                        <h2 id="lastUpdated" className="capitalize">
                                            {lastUpdated}
                                        </h2>
                                    </div>
                                </div>
                   </Paper>
                </Grid>
               </Grid>
             </div>
    );
}

export default Last;
