import request from 'supertest';
import bcrypt from 'bcrypt';
import {
    describe,
    test,
    expect,
    beforeEach,
    mock
} from "bun:test";

let verificationToken;

beforeEach(() => {
    verificationToken = undefined;
});

mock.module("../src/services/nodemailer.js", () => ({
    sendVerificationEmail: async (email, token) => {
        verificationToken = token;
    }
}));

const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/models/User.js');

describe('Authentication test', () => {
    const user = {
        name: "Test Name",
        email: "test@example.com",
        password: "testPassword@123"
    };

    test('POST /api/auth/user/register', async () => {
        const response = await request(app)
            .post('/api/auth/user/register')
            .send(user);

        const createdUser = await User.findOne({ email: user.email })
            .select("+verificationToken +verificationTokenExpires");

        expect(createdUser.isVerified).toBe(false);
        expect(createdUser.verificationToken).toBeDefined();
        expect(createdUser.verificationTokenExpires).toBeDefined();
    });

    test('POST /api/auth/user/login', async () => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        await User.create({
            name: user.name,
            email: user.email,
            password: hashedPassword,
            isVerified: true
        });

        const response = await request(app)
            .post('/api/auth/user/login')
            .send({
                email: "test@example.com",
                password: "testPassword@123"
            });

        expect(response.statusCode).toBe(200);
        expect(response.headers["set-cookie"]).toBeDefined();
    });

    test('POST /api/auth/user/logout', async () => {
        const agent = request.agent(app);

        await agent
            .post('/api/auth/user/register')
            .send(user);

        const theUser = await User.findOne({ email: user.email });

        theUser.isVerified = true;
        await theUser.save();

        const loginResponse = await agent
            .post('/api/auth/user/login')
            .send({
                email: user.email,
                password: user.password
            });

        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.headers["set-cookie"]).toBeDefined();

        const logoutResponse = await agent
            .post('/api/auth/user/logout');

        expect(logoutResponse.statusCode).toBe(200);
    });

    test('PUT /api/auth/user/update - updates name and password', async () => {
        await request(app).post('/api/auth/user/register').send(user);

        const theUser = await User.findOne({ email: user.email });
        theUser.isVerified = true;
        await theUser.save();

        const loginResponse = await request(app)
            .post('/api/auth/user/login')
            .send({ email: user.email, password: user.password });

        const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

        const updateResponse = await request(app)
            .put('/api/auth/user/update')
            .set("Cookie", cookie)
            .send({
                name: "Updated Name",
                currentPassword: user.password,
                newPassword: "newPassword@123"
            });

        expect(updateResponse.statusCode).toBe(200);

        const updatedUser = await User.findOne({ email: user.email });
        expect(updatedUser.name).toBe("Updated Name");
        expect(await bcrypt.compare("newPassword@123", updatedUser.password)).toBe(true);
    });

    test('PUT /api/auth/user/update - requires current password for new password', async () => {
        await request(app).post('/api/auth/user/register').send(user);

        const theUser = await User.findOne({ email: user.email });
        theUser.isVerified = true;
        await theUser.save();

        const loginResponse = await request(app)
            .post('/api/auth/user/login')
            .send({ email: user.email, password: user.password });

        const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

        const updateResponse = await request(app)
            .put('/api/auth/user/update')
            .set("Cookie", cookie)
            .send({
                newPassword: "newPassword@123"
            });

        expect(updateResponse.statusCode).toBe(400);
    });

    test('DELETE /api/auth/user/delete - deletes account', async () => {
        await request(app).post('/api/auth/user/register').send(user);

        const theUser = await User.findOne({ email: user.email });
        theUser.isVerified = true;
        await theUser.save();

        const loginResponse = await request(app)
            .post('/api/auth/user/login')
            .send({ email: user.email, password: user.password });

        const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

        const deleteResponse = await request(app)
            .delete('/api/auth/user/delete')
            .set("Cookie", cookie);

        expect(deleteResponse.statusCode).toBe(200);

        const deletedUser = await User.findOne({ email: user.email });
        expect(deletedUser).toBeNull();
    });

});