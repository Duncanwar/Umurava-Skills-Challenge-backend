import prisma from "../../client";
import ChallengeService from "../services/ChallengeService";
import UserService from "../services/UserService";
import catchAsync from "../utils/catchAsync";
import Response from "../utils/response";
import { challengeSchema } from "../validations/Challenge.validation";
import AuthController from "./AuthController";

export default class ChallengeController {
  static assignChallenge = catchAsync(async (req, res) => {
    const { participantId, challengeId } = req.body;
    // get the challenge assigned to the participants
    const userData = await UserService.findUserById(participantId);
    const participantChallenge = userData?.challengeIDs;

    if (!participantChallenge?.includes(challengeId))
      participantChallenge?.push(challengeId);
    else return Response.error(res, 403, "Already have this challenge", {});

    // get participants who are working on the challenge
    const challengeData = await ChallengeService.findById(challengeId);
    const assignParticipantToTheChallenge = challengeData?.participantIDs;

    if (!assignParticipantToTheChallenge?.includes(participantId))
      assignParticipantToTheChallenge?.push(participantId);
    else
      return Response.error(
        res,
        403,
        "Already have assigned this challenge to the participant",
        {}
      );

    const updateUser = await prisma.user.update({
      where: { id: participantId },
      data: { challengeIDs: participantChallenge },
    });
    const updateChallenge = await prisma.challenge.update({
      where: { id: challengeId },
      data: { participantIDs: assignParticipantToTheChallenge },
    });
    return Response.success(res, 200, "updated", {
      updateChallenge,
      updateUser,
    });
  });

  static createChallenge = catchAsync(async (req, res) => {
    const data = req.body;
    const { error } = challengeSchema.validate(data);
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return Response.error(res, 400, "Validation Error", {
        errors: validationErrors[0].replace(/"/g, ""),
      });
    }
    const titleExist = await ChallengeService.findByName(data.title);
    if (titleExist) {
      return Response.error(
        res,
        409,
        "Challenge with that title already exists",
        {}
      );
    }
    const challenge = await ChallengeService.create({
      ...data,
      deadline: new Date(data.deadline).toISOString(),
    });
    return Response.success(res, 201, "Challenge created", { challenge });
  });

  static getAllChallenges = catchAsync(async (req, res) => {
    const challenges = await ChallengeService.findAll();

    return Response.success(res, 200, "Retrieve Challenges", challenges);
  });

  static getOneChallenge = catchAsync(async (req, res) => {
    const { id } = req.params;
    const challenge = await ChallengeService.findById(id);
    if (!challenge) return Response.error(res, 404, "product not found");
    return Response.success(res, 200, "Retrieve Challenges", challenge);
  });

  static updateChallenge = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const challenge = await ChallengeService.findById(id);
    if (!challenge) return Response.error(res, 404, "product not found");
    const updateChallenge = await ChallengeService.update(id, data);
    return Response.success(res, 200, "Updated Challenge", updateChallenge);
  });

  static deleteChallenge = catchAsync(async (req, res) => {
    const { id } = req.params;
    const challenge = await ChallengeService.findById(id);
    if (!challenge) return Response.error(res, 404, "product not found");
    const deleteChallenge = await ChallengeService.delete(id);
    return Response.success(res, 200, "Deleted Challenge", deleteChallenge);
  });
}
