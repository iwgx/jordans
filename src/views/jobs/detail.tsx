import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";

import { IJob } from "../../interfaces";
import { ReactComponent as LeftArrow } from "../../assets/leftArrow.svg";
import { getJob } from "../../service";
import { JobDetailSkeletonView } from "../../components/SkeletonView";

interface IProps {
  jobs: IJob[];
  authenticated: boolean;
}

const JobsDetail: React.FC<IProps> = ({ jobs, authenticated }) => {
  const { id } = useParams();
  const history = useHistory();
  const [job, setJob] = useState<IJob>();
  const [openApply, setOpenApply] = useState(false);

  const getData = useCallback(async () => {
    const { data } = await getJob(id);
    setJob(data);
  }, [setJob, id]);

  useEffect(() => {
    if (!authenticated) return;

    if (jobs.length === 0) getData();
    else setJob(jobs.find((item) => item.id === id));
  }, [id, jobs, authenticated, getData]);

  if (!authenticated) history.push("/");
  return (
    <Container>
      <Link to="/jobs" className="allJobs">
        <LeftArrow className="arrow" />
        All Jobs
      </Link>
      {job ? (
        <>
          <h1 className="title">{job.title}</h1>
          <span className="type">{job.type}</span>
          <p className="company">
            <a className="companyURL" href={job.company_url || ""}>
              {job.company}
            </a>
            {" - "}
            {job.location}
          </p>
          <p
            className="description"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
          <ApplyButton onClick={() => setOpenApply(!openApply)}>
            APPLY
          </ApplyButton>
          {openApply && (
            <p
              className="apply"
              dangerouslySetInnerHTML={{ __html: job.how_to_apply }}
            />
          )}
        </>
      ) : (
        <JobDetailSkeletonView />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem 2rem 5rem;
  max-width: 720px;
  margin: 0 auto;

  .allJobs {
    display: flex;
    width: fit-content;
    align-items: center;
    text-decoration: none;
    border: none;
    background: #0b3954;
    color: #f7f9f9;
    padding: 0.5rem 0.75rem;
    margin-bottom: 3rem;
    border-radius: 0.25rem;

    .arrow {
      width: 14px;
      fill: white;
      margin-right: 0.5rem;
    }
  }

  .title {
    margin-top: 0;
  }

  .type {
    font-size: 1rem;
    color: #f7f9f9;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    background-color: #129490;
  }

  .companyURL {
    text-decoration: none;
    color: inherit;
    padding-bottom: 0.125rem;
    border-bottom: 1px solid black;
  }
`;

const ApplyButton = styled.button`
  display: block;
  margin-top: 1.5rem;
  border: none;
  background-color: #0b3954;
  color: #f7f9f9;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  width: 100%;
  box-sizing: border-box;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
`;

export default JobsDetail;
